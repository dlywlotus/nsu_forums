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

// change user name
func ChangeUsername(c *gin.Context) {
	//Get data off request body
	var body struct {
		UserID   string
		Username string
	}
	c.Bind(&body)

	//Create user
	user := models.User{ID: body.UserID}
	res := initialisers.DB.Model(&user).Update("username", body.Username)

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"new_username": body.Username,
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
