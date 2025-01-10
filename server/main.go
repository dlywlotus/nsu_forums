package main

import (
	"os"

	"github.com/dlywlotus/go-crud/controllers"
	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	// Un-comment this if not hosting on localhost
	// initialisers.LoadEnvVariables()
	initialisers.ConnectToDb()
}

func main() {

	r := gin.Default()

	//middleware

	//CORS configuration to allow Authorization header
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
	}))

	//unprotected routes
	r.GET("/user/:user_id", controllers.GetUserDetails)
	r.POST("/signup", controllers.HandleUserSignUp)

	r.GET("/post/:post_id", controllers.GetPost)
	r.GET("/posts", controllers.GetPosts)

	//Like handlers
	r.POST("likes", controllers.CreateLike)
	r.DELETE("likes", controllers.DeleteLike)

	// Protected routes
	authRequired := r.Group("/auth_req")
	authRequired.Use(middleware.AuthMiddleware())

	authRequired.POST("/create_post", controllers.CreatePost)
	authRequired.DELETE("/delete_post/:post_id", controllers.DeletePost)
	authRequired.PUT("/edit_post/:post_id", controllers.EditPost)

	authRequired.POST("/create_comment", controllers.CreateComment)
	authRequired.DELETE("/delete_comment", controllers.DeleteComment)
	authRequired.PUT("/edit_user/:user_id", controllers.ChangeUserDetails)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	r.Run(":" + port)
}
