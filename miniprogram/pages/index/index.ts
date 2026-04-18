type Category = {
  id: number
  name: string
}

type GalleryItem = {
  src: string
  tag: string
  categoryId: number
}

Component({
  data: {
    activeCategoryId: 0,
    categories: [
      { id: 0, name: '全部' },
      { id: 1, name: '丽江婚礼' },
      { id: 2, name: '丽江旅拍' },
      { id: 3, name: '三亚婚礼' },
      { id: 4, name: '海岛旅拍' },
    ] as Category[],
    allImages: [
      { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 1 },
      { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 1 },
      { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 2 },
      { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 2 },
      { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 3 },
      { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 3 },
      { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 4 },
      { src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80', tag: '九言集', categoryId: 4 },
    ] as GalleryItem[],
    displayImages: [] as GalleryItem[],
  },

  lifetimes: {
    attached() {
      this.updateDisplayImages(0)
    },
  },

  methods: {
    onTapCategory(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset as { id: number }
      this.setData({ activeCategoryId: id })
      this.updateDisplayImages(id)
    },

    updateDisplayImages(categoryId: number) {
      const { allImages } = this.data
      const displayImages =
        categoryId === 0 ? allImages : allImages.filter((item) => item.categoryId === categoryId)

      this.setData({ displayImages })
    },
  },
})
