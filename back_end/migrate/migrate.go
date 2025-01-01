package main

import (
	"github.com/dlywlotus/go-crud/initialisers"
	"github.com/dlywlotus/go-crud/models"
)

//run file to create tables in database with declared models

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDb()
}

func main() {
	initialisers.DB.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Like{},
		&models.Comment{})
}
