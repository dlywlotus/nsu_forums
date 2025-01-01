package controllers

import (
	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/models"
	"github.com/gin-gonic/gin"
)

func CreateLike(c *gin.Context) {
	//Get data off request body
	var body struct {
		UserID string
		PostID uint
	}
	c.Bind(&body)

	//Create Like
	like := models.Like{UserID: body.UserID, PostID: body.PostID}
	result := initialisers.DB.Create(&like)

	if result.Error != nil {
		c.Status(400)
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"created_like": like,
	})
}

func DeleteLike(c *gin.Context) {
	//Get data off request body
	var body struct {
		UserID string
		PostID uint
	}
	c.Bind(&body)

	//Delete Like
	like := models.Like{UserID: body.UserID, PostID: body.PostID}
	result := initialisers.DB.Delete(&like)

	if result.Error != nil {
		c.Status(400)
		return
	}

	//Return it
	c.JSON(200, gin.H{
		"delete": "success",
	})
}
