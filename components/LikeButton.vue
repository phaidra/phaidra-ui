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
  data() {
    return {
      likes: 0
    }
  },
  methods: {
    incrementLikes() {
      this.likes++
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