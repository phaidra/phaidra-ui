<template>
  <div class="like-container">
    <button @click="incrementLikes" class="like-button">
      Like
    </button>
    <span class="like-counter">{{ likes }}</span>
  </div>
</template>

<script>
export default {
  name: 'LikeButton',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      likes: 0
    }
  },
  created() {
    if (process.client) {
      const savedLikes = localStorage.getItem(`likeCount_${this.id}`)
      if (savedLikes) {
        this.likes = parseInt(savedLikes)
      }
    }
  },
  methods: {
    incrementLikes() {
      this.likes++
      if (process.client) {
        localStorage.setItem(`likeCount_${this.id}`, this.likes.toString())
      }
    }
  }
}
</script>

<style scoped>
.like-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.like-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.like-button:hover {
  background-color: #45a049;
}

.like-counter {
  font-size: 18px;
  font-weight: bold;
}
</style> 