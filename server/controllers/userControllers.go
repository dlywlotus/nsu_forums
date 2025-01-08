package controllers

import (
	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/models"
	"github.com/gin-gonic/gin"
)

// sign up user
func HandleUserSignUp(c *gin.Context) {
	//Get data off request body
	var body struct {
		ID       string
		Username string
	}
	c.Bind(&body)

	//Create user
	user := models.User{ID: body.ID, Username: body.Username}
	res := initialisers.DB.Create(&user)

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"created_user": user,
	})
}

// get user details
func GetUserDetails(c *gin.Context) {
	//Get data off request body
	userId := c.Param("user_id")

	//Create user
	user := models.User{ID: userId}
	res := initialisers.DB.First(&user)

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"user": user,
	})
}

// change user details
func ChangeUserDetails(c *gin.Context) {
	userId := c.Param("user_id")
	//Get data off request body
	var body struct {
		ProfilePic string
		Username   string
	}
	c.Bind(&body)

	//Create user
	user := models.User{ID: userId}
	res := initialisers.DB.Model(&user)

	if body.ProfilePic == "" {
		res = res.Update("username", body.Username)
	} else {
		res = res.Update("profile_pic", body.ProfilePic)
	}

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"new_user": user,
	})
}
