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
    activeTab: 0,
    activeCategoryId: 0,
    categories: [
      { id: 0, name: '全部' },
      { id: 1, name: '日系' },
      { id: 2, name: '韩系' },
      { id: 3, name: '胶片' },
      { id: 4, name: '审美积累' },
    ] as Category[],
    allImages: [
      { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 1 },
      { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 2 },
      { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 3 },
      { src: 'https://img.keviecc.online/2026/04/19/2f16a671-9740-4fc0-bd12-2567cb718215/1.jpg', tag: 'kk留白影像', categoryId: 4 },
    ] as GalleryItem[],
    displayImages: [] as GalleryItem[],
    currentPage: 1,
    hasMore: true,
  },

  lifetimes: {
    attached() {
      this.updateDisplayImages(0)
    },
  },

  methods: {
    onTapTab(e: WechatMiniprogram.BaseEvent) {
      const tab = Number(e.currentTarget.dataset.tab)
      this.setData({ activeTab: tab })
    },

    onTapCategory(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset as { id: number }
      this.setData({ activeCategoryId: id, currentPage: 1, displayImages: [], hasMore: true })
      this.updateDisplayImages(id)
    },

    onTapImage(e: WechatMiniprogram.BaseEvent) {
      const { src } = e.currentTarget.dataset as { src: string }
      const { allImages, activeCategoryId } = this.data
      const filtered = activeCategoryId === 0 ? allImages : allImages.filter((item) => item.categoryId === activeCategoryId)
      const urls = filtered.map((item) => item.src)

      wx.previewImage({
        current: src,
        urls,
      })
    },

    onScrollToLower() {
      if (!this.data.hasMore) return
      const nextPage = this.data.currentPage + 1
      this.setData({ currentPage: nextPage })
      this.updateDisplayImages(this.data.activeCategoryId)
    },

    updateDisplayImages(categoryId: number) {
      const PAGE_SIZE = 30
      const { allImages, currentPage } = this.data
      const filtered = categoryId === 0 ? allImages : allImages.filter((item) => item.categoryId === categoryId)
      const paged = filtered.slice(0, currentPage * PAGE_SIZE)
      const hasMore = paged.length < filtered.length

      this.setData({ displayImages: paged, hasMore })
    },
  },
})
