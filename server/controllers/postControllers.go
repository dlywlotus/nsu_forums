package controllers

import (
	"strconv"

	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/models"
	"github.com/gin-gonic/gin"
)

// Get posts
// filter with query param - sort by, category, search keyword
// pagination done with offset and pages
// provide userId to get the boolean field UserLiked
// optionally gets all posts from a single author
func GetPosts(c *gin.Context) {
	sortBy := c.DefaultQuery("sort", "new")
	category := c.DefaultQuery("cat", "all")
	p := c.DefaultQuery("page", "1")
	selfPosted := c.DefaultQuery("self", "false")
	searchKeyword := c.Query("q")
	userId := c.Query("user_id")
	limit := 10

	//convert page to int
	page, err := strconv.Atoi(p)
	if err != nil {
		page = 1
	}

	//calc offset
	offset := (page - 1) * limit

	//if empty, set the userId to some random uuid to clear type error
	if userId == "" {
		userId = "eca41525-c3d0-4911-9c88-c6e6ecd31fe6"
	}

	type Post struct {
		models.Post
		Username     string
		UserLiked    bool
		LikeCount    uint
		CommentCount uint
		ProfilePic   *string
	}

	var posts []Post
	res := initialisers.DB.Table("posts").
		Select(`posts.*, users.username, users.profile_pic, 
			COUNT(DISTINCT likes.user_id) AS like_count, 
			EXISTS (
				SELECT 1 
				FROM likes 
				WHERE likes.user_id = ? AND likes.post_id = posts.id) 
			AS user_liked,
			COUNT(DISTINCT comments.id) AS comment_count`, userId).
		Joins("inner join users ON posts.author_id = users.id").
		Joins("left join comments ON posts.id = comments.post_id").
		Joins("left join likes ON posts.id = likes.post_id").
		Group("posts.id, users.username, users.profile_pic").
		Where("posts.deleted_at IS NULL").
		Offset(offset).
		Limit(limit)

	//Conditionally apply category filter
	if category != "all" {
		res = res.Where("posts.category = ?", category)
	}

	//Conditionally apply search query
	if searchKeyword != "" {
		res = res.Where("to_tsvector('english', posts.title || ' ' || posts.body) @@ phraseto_tsquery(?)", searchKeyword)
	}

	//Conditionally only get posts published by user
	if selfPosted == "true" {
		res = res.Where("posts.author_id = ?", userId)
	}

	//Conditionally sort by new or sort by likes
	if sortBy == "new" {
		res.Order("posts.created_at DESC")
	} else {
		res.Order("like_count DESC")
	}

	res.Scan(&posts)

	// Determine if there are more pages
	var nextPage *int
	if len(posts) < limit {
		nextPage = nil
	} else {
		np := page + 1
		nextPage = &np
	}

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"posts":       posts,
		"currentPage": page,
		"nextPage":    nextPage,
	})
}

// Get single post by post id with its comments
func GetPost(c *gin.Context) {
	postId := c.Param("post_id")
	userId := c.Query("user_id")

	//if empty, set the userId to some random uuid to clear type error
	if userId == "" {
		userId = "eca41525-c3d0-4911-9c88-c6e6ecd31fe6"
	}

	type Post struct {
		models.Post
		Username     string
		UserLiked    bool
		LikeCount    int
		CommentCount int
		ProfilePic   *string
	}

	var post Post
	res := initialisers.DB.Table("posts").
		Select(`posts.*, 
			users.username,
			users.profile_pic,
			COUNT(likes.user_id) AS like_count,
			EXISTS (
				SELECT 1
				FROM likes
				WHERE likes.user_id = ? AND likes.post_id = posts.id
			) AS user_liked`, userId).
		Joins("INNER JOIN users ON posts.author_id = users.id").
		Joins("LEFT JOIN likes ON posts.id = likes.post_id").
		Where("posts.id = ?", postId).
		Group("posts.id, users.username, users.profile_pic").
		Scan(&post)

	type Comment struct {
		models.Comment
		Username   string
		ProfilePic *string
	}

	type ParentComment struct {
		Comment
		Replies []Comment `gorm:"-"` // Exclude from GORM mapping
	}

	parentComments := make([]ParentComment, 0)
	parentCommentsRes := initialisers.DB.Table("comments").
		Select("comments.*, users.username, users.profile_pic").
		Joins("INNER JOIN users ON comments.author_id = users.id").
		Where("post_id = ?", postId).
		Order("comments.id DESC").
		Where("comments.reply_id IS NULL").
		Scan(&parentComments)

	childComments := make([]Comment, 0)
	childCommentsRes := initialisers.DB.Table("comments").
		Select("comments.*, users.username, users.profile_pic").
		Joins("INNER JOIN users ON comments.author_id = users.id").
		Where("post_id = ?", postId).
		Order("comments.id DESC").
		Where("comments.reply_id IS NOT NULL").
		Scan(&childComments)

	if res.Error != nil ||
		childCommentsRes.Error != nil ||
		parentCommentsRes.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	post.CommentCount = len(parentComments) + len(childComments)

	//populate Replies field for each parent comment
	for i := range parentComments {
		for _, child := range childComments {
			if *child.ReplyID == parentComments[i].ID {
				parentComments[i].Replies = append(parentComments[i].Replies, child)
			}
		}
	}

	c.JSON(200, gin.H{
		"post":     post,
		"comments": parentComments,
	})
}

func CreatePost(c *gin.Context) {
	//Get data off request body
	var body struct {
		Title    string
		Body     string
		Category string
		AuthorID string
	}
	c.Bind(&body)

	//Create a post
	post := models.Post{Title: body.Title, Body: body.Body, Category: body.Category, AuthorID: body.AuthorID}
	res := initialisers.DB.Create(&post)

	if res.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"post": post,
	})
}

func DeletePost(c *gin.Context) {
	postId := c.Param("post_id")

	post := models.Post{}
	res := initialisers.DB.Delete(&post, postId)

	if res.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"deleted_post": post,
	})
}

func EditPost(c *gin.Context) {
	postId := c.Param("post_id")
	//Get data off request body
	var body struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	}
	c.Bind(&body)

	post := models.Post{}

	res := initialisers.DB.Model(&post).Where("posts.id = ?", postId).Updates(&models.Post{Title: body.Title, Body: body.Body})

	if res.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"updated_post": post,
	})
}
