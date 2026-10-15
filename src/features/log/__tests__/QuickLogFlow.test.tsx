import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeSupabase } from '@/test/fakeSupabase'

vi.mock('@/services/supabaseClient', () => ({ supabase: createFakeSupabase() }))
vi.mock('@/utils/image', () => ({
  compressImage: vi.fn(async () => 'data:image/jpeg;base64,mock'),
}))

import * as draftService from '@/services/draftService'
import * as logService from '@/services/logService'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/store'
import QuickLogFlow from '../components/QuickLogFlow'

const fakeSupabase = supabase as unknown as ReturnType<typeof createFakeSupabase>
const TEST_USER = { id: 'user-1', name: 'Test User', createdAt: '2026-01-01T00:00:00.000Z' }

function renderFlow() {
  return render(
    <MemoryRouter initialEntries={['/log/new']}>
      <QuickLogFlow />
    </MemoryRouter>,
  )
}

async function uploadPhoto() {
  const file = new File(['img'], 'meal.png', { type: 'image/png' })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  await userEvent.upload(input, file)
}

describe('QuickLogFlow', () => {
  beforeEach(() => {
    localStorage.clear()
    fakeSupabase.reset()
    useAuthStore.setState({ user: TEST_USER, hasSession: true, hydrated: true, isOnboarded: true })
  })

  it('starts on the photo step and advances once a photo is selected', async () => {
    renderFlow()
    expect(await screen.findByText('Snap your meal')).toBeInTheDocument()

    await uploadPhoto()

    expect(await screen.findByText('Where & what?')).toBeInTheDocument()
  })

  it('renders all five Playbook score options with accessible names', async () => {
    renderFlow()
    await uploadPhoto()

    await userEvent.type(await screen.findByLabelText("Where'd you eat?"), 'Big Star')
    await userEvent.type(screen.getByLabelText("What'd you eat?"), 'Tacos')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    for (const label of ['Fumble', 'Punt', 'First Down', 'Touchdown', 'Hail Mary Touchdown']) {
      expect(await screen.findByRole('radio', { name: label })).toBeInTheDocument()
    }
  })

  it('blocks save and shows a validation message when dish name is missing', async () => {
    const createSpy = vi.spyOn(logService, 'createLog')
    renderFlow()
    await uploadPhoto()

    await userEvent.type(await screen.findByLabelText("Where'd you eat?"), 'Big Star')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await userEvent.type(await screen.findByLabelText("What'd you pay?"), '14.50')
    await userEvent.click(await screen.findByRole('radio', { name: 'Hail Mary Touchdown' }))

    await userEvent.click(await screen.findByRole('button', { name: 'Save Log' }))

    expect(await screen.findByText('Add what you ate.')).toBeInTheDocument()
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('saves a complete log and clears the draft', async () => {
    renderFlow()
    await uploadPhoto()

    await userEvent.type(await screen.findByLabelText("Where'd you eat?"), 'Big Star')
    await userEvent.type(screen.getByLabelText("What'd you eat?"), 'Tacos')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await userEvent.type(await screen.findByLabelText("What'd you pay?"), '14.50')
    await userEvent.click(await screen.findByRole('radio', { name: 'Hail Mary Touchdown' }))

    await userEvent.click(await screen.findByRole('button', { name: 'Save Log' }))

    await waitFor(async () => {
      const logs = await logService.listLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].dishName).toBe('Tacos')
      expect(logs[0].score).toBe('hail-mary-touchdown')
    })

    expect(draftService.getDraft()).toBeNull()
  })

  it('restores a draft after remount', async () => {
    const { unmount } = renderFlow()
    await uploadPhoto()

    await userEvent.type(await screen.findByLabelText("Where'd you eat?"), 'Big Star')

    await waitFor(() => {
      expect(draftService.getDraft()?.spotName).toBe('Big Star')
    })

    unmount()
    renderFlow()

    expect(await screen.findByDisplayValue('Big Star')).toBeInTheDocument()
  })
})
