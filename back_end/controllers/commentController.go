package controllers

import (
	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/models"
	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	//Get data off request body
	var body struct {
		Body     string
		AuthorID string
		PostID   uint
		ReplyID  *uint
	}
	c.Bind(&body)
	//Create comment

	comment := models.Comment{Body: body.Body, AuthorID: body.AuthorID, PostID: body.PostID, ReplyID: body.ReplyID}
	if res := initialisers.DB.Create(&comment); res.Error != nil {
		c.Status(400)
		return
	}

	var userName string
	if usernameRes := initialisers.DB.
		Table("users").
		Select("users.username").
		Where("users.id = ?", body.AuthorID).
		Scan(&userName); usernameRes.Error != nil {
		c.Status(400)
		return
	}

	type NewComment struct {
		models.Comment
		Username string
	}

	newComment := NewComment{comment, userName}

	c.JSON(200, gin.H{
		"created_comment": newComment,
	})

}

func DeleteComment(c *gin.Context) {
	//Get data off request body
	var body struct {
		CommentID uint
	}
	c.Bind(&body)

	//Delete comment
	comment := models.Comment{}
	res := initialisers.DB.Where("id = ?", body.CommentID).Delete(&comment)

	if res.Error != nil {
		c.Status(400)

	} else {
		c.JSON(200, gin.H{
			"delete": "success",
		})
	}

}

//?? update comment
