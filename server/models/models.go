package models

import (
	"gorm.io/gorm"
)

//foreign keys manually added in supabase

// Foreign key: AuthorID references user.ID
type Post struct {
	gorm.Model
	Title    string `gorm:"type:varchar(255);not null"`
	Body     string `gorm:"type:text"`
	Category string `gorm:"type:varchar(15);default:'others';not null;index"`
	AuthorID string `gorm:"type:uuid;not null;index"`
}

// Foreign key: ID references auth.user.id (supabase auth table)
type User struct {
	ID         string `gorm:"type:uuid;primaryKey"`
	Username   string `gorm:"type:varchar(50);not null;unique"`
	ProfilePic *string
}

// Foreign key: UserID references user.ID
// Foreign key: PostID references post.ID
type Like struct {
	UserID string `gorm:"primaryKey;type:uuid;index"`
	PostID uint   `gorm:"primaryKey;index"`
}

// Foreign key: PostID references post.ID
// Foreign key: AuthorID references user.ID
type Comment struct {
	gorm.Model
	Body     string `gorm:"type:text"`
	AuthorID string `gorm:"type:uuid;not null;index"`
	PostID   uint
	ReplyID  *uint
}
