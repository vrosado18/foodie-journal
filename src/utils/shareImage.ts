import { SCORE_META, type Score } from '@/types'
import { formatPrice } from './formatters'

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1920
const PHOTO_HEIGHT = 1344 // ~70% of canvas height

// Duplicated from the Tailwind design tokens — canvas can't read CSS custom
// properties, so these stay in sync manually with src/index.css.
const SCORE_COLORS: Record<Score, string> = {
  fumble: '#dc2626',
  punt: '#f97316',
  'first-down': '#eab308',
  touchdown: '#16a34a',
  'hail-mary-touchdown': '#7c3aed',
}

export interface ShareCardInput {
  photoUrl: string
  spotName: string
  dishName: string
  score: Score
  price: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the photo for the share card'))
    img.src = src
  })
}

function drawCoverFit(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / img.width, height / img.height)
  const drawWidth = img.width * scale
  const drawHeight = img.height * scale
  const dx = (width - drawWidth) / 2
  const dy = (height - drawHeight) / 2
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight)
}

export async function generateShareCardBlob(input: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  // Background
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Photo
  const img = await loadImage(input.photoUrl)
  drawCoverFit(ctx, img, CANVAS_WIDTH, PHOTO_HEIGHT)

  // Score ribbon, top-left over the photo
  const scoreColor = SCORE_COLORS[input.score]
  const scoreLabel = SCORE_META[input.score].label.toUpperCase()
  ctx.font = '700 40px Arial, sans-serif'
  const ribbonWidth = ctx.measureText(scoreLabel).width + 80
  ctx.fillStyle = scoreColor
  ctx.beginPath()
  ctx.roundRect(48, 48, ribbonWidth, 88, 44)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(scoreLabel, 88, 48 + 44)

  // Bottom info panel
  const panelY = PHOTO_HEIGHT
  const panelHeight = CANVAS_HEIGHT - PHOTO_HEIGHT
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, panelY, CANVAS_WIDTH, panelHeight)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px Arial, sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(input.dishName, 56, panelY + 110, CANVAS_WIDTH - 112)

  ctx.fillStyle = '#cbd5e1'
  ctx.font = '400 44px Arial, sans-serif'
  ctx.fillText(input.spotName, 56, panelY + 180, CANVAS_WIDTH - 112)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 56px Arial, sans-serif'
  ctx.fillText(formatPrice(input.price), 56, panelY + 280)

  ctx.fillStyle = '#64748b'
  ctx.font = '400 36px Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Foodie Journal', CANVAS_WIDTH - 56, panelY + 280)
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not generate the share card'))),
      'image/jpeg',
      0.92,
    )
  })
}
