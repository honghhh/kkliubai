type Category = {
  id: number
  name: string
}

type GalleryItem = {
  src: string
  tag: string
  categoryId: number
}

type VideoItem = {
  id: number
  title: string
  src: string
  poster: string
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
      { id: 4, name: '森系' },
      { id: 5, name: '指导动作' },
      { id: 6, name: '审美积累' },
      { id: 7, name: '视频' },
    ] as Category[],
    allImages: [
      { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 1 },
      { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 2 },
      { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', tag: 'kk留白影像', categoryId: 3 },
      { src: 'https://img.keviecc.online/2026/04/26/e8021b90-9def-490c-8a19-94e8f4501b3d/2a29ed2e194832621f0333c9891494e3.jpg', tag: 'kk留白影像', categoryId: 6 },
      { src: 'https://img.keviecc.online/2026/04/27/b3649735-2155-4ec5-a3cf-45b888b6a6ac/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260426201603_478_958.jpg', tag: 'kk留白影像', categoryId: 6 },
    ] as GalleryItem[],
    videos: [
      {
        id: 1,
        title: '富士参数设置',
        src: 'https://k0u2ay30y79y8fzw2408x8752x0x101xxfz.djvod.ndcimgs.com/upic/2026/04/26/17/BMjAyNjA0MjYxNzA5NTlfMTMwMDIyNzEwOV8xOTQxOTg0NDQxMjFfMF8z_b_B3633f7861e231b6f02b0aec502d08d0f.mp4',
      },
      {
        id: 2,
        title: '亚索1V2',
        src: 'https://txmov2.a.yximgs.com/upic/2023/02/11/23/BMjAyMzAyMTEyMzUwMTZfMTMwMDIyNzEwOV85NjAxMzU3MDQ2MV8wXzM=_b_Bd1cb86d41f45b65fc4336b2bc57db094.mp4',
      },
      {
        id: 3,
        title: '亚索1V2',
        src: 'https://txmov2.a.yximgs.com/upic/2023/05/02/12/BMjAyMzA1MDIxMjA0MjBfMTMwMDIyNzEwOV8xMDIwNjMyMDgxNzBfMF8z_b_B51ffeb6beaee56576ee17e461fe5a433.mp4',
      },
    ] as VideoItem[],
    displayImages: [] as GalleryItem[],
    displayVideos: [] as VideoItem[],
    aestheticZoomEnabled: false,
    videoVisible: false,
    fullscreenVideoId: 0,
    currentPage: 1,
    hasMore: true,
    videoCurrentPage: 1,
    videoHasMore: true,
  },

  lifetimes: {
    attached() {
      this.updateDisplayImages(0)
      this.updateDisplayVideos()
    },
  },

  methods: {
    getImagesByCategory(categoryId: number) {
      const { allImages } = this.data

      if (categoryId === 0) {
        return allImages.filter((item) => item.categoryId !== 5 && item.categoryId !== 6)
      }

      return allImages.filter((item) => item.categoryId === categoryId)
    },

    onTapTab(e: WechatMiniprogram.BaseEvent) {
      const tab = Number(e.currentTarget.dataset.tab)
      this.setData({ activeTab: tab })
    },

    onTapCategory(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset as { id: number }
      this.setData({
        activeCategoryId: id,
        currentPage: 1,
        displayImages: [],
        hasMore: true,
        videoCurrentPage: 1,
        displayVideos: [],
        videoHasMore: true,
      })

      if (id === 7) {
        this.updateDisplayVideos()
        return
      }

      this.updateDisplayImages(id)
    },

    onTapImage(e: WechatMiniprogram.BaseEvent) {
      const { src } = e.currentTarget.dataset as { src: string }
      const { activeCategoryId, aestheticZoomEnabled } = this.data

      if (activeCategoryId === 6 && !aestheticZoomEnabled) {
        return
      }

      const filtered = this.getImagesByCategory(activeCategoryId)
      const urls = filtered.map((item) => item.src)

      wx.previewImage({
        current: src,
        urls,
      })
    },

    onTapProfileImage() {
      const src = '/images/个人简介.jpg'

      wx.previewImage({
        current: src,
        urls: [src],
      })
    },

    onScrollToLower() {
      if (this.data.activeCategoryId === 7) {
        if (!this.data.videoHasMore) return
        const nextVideoPage = this.data.videoCurrentPage + 1
        this.setData({ videoCurrentPage: nextVideoPage })
        this.updateDisplayVideos()
        return
      }

      if (!this.data.hasMore) return
      const nextPage = this.data.currentPage + 1
      this.setData({ currentPage: nextPage })
      this.updateDisplayImages(this.data.activeCategoryId)
    },

    onToggleVideoVisible(e: WechatMiniprogram.CustomEvent<{ value: boolean }>) {
      this.setData({ videoVisible: e.detail.value })
    },

    onToggleAestheticZoom(e: WechatMiniprogram.CustomEvent<{ value: boolean }>) {
      this.setData({ aestheticZoomEnabled: e.detail.value })
    },

    onTapVideoFullscreen(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset as { id: number }
      const videoContext = wx.createVideoContext(`video-${id}`, this)
      videoContext.requestFullScreen({ direction: 90 })
      this.setData({ fullscreenVideoId: Number(id) })
    },

    onVideoFullscreenChange(e: WechatMiniprogram.CustomEvent<{ fullScreen: boolean }>) {
      const { id } = e.currentTarget.dataset as { id: number }

      if (!e.detail.fullScreen && this.data.fullscreenVideoId === Number(id)) {
        this.setData({ fullscreenVideoId: 0 })
      }
    },

    onVideoEnded(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset as { id: number }
      const videoId = Number(id)
      const videoContext = wx.createVideoContext(`video-${videoId}`, this)

      // 播放结束后自动退出全屏，并保持在结束帧（不回退到 0）
      videoContext.exitFullScreen()
      videoContext.pause()

      if (this.data.fullscreenVideoId === videoId) {
        this.setData({ fullscreenVideoId: 0 })
      }
    },

    updateDisplayImages(categoryId: number) {
      const PAGE_SIZE = 30
      const { currentPage } = this.data
      const filtered = this.getImagesByCategory(categoryId)
      const paged = filtered.slice(0, currentPage * PAGE_SIZE)
      const hasMore = paged.length < filtered.length

      this.setData({ displayImages: paged, hasMore })
    },

    updateDisplayVideos() {
      const PAGE_SIZE = 10
      const { videos, videoCurrentPage } = this.data
      const paged = videos.slice(0, videoCurrentPage * PAGE_SIZE)
      const videoHasMore = paged.length < videos.length

      this.setData({ displayVideos: paged, videoHasMore })
    },
  },
})
