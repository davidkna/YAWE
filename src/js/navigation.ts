import { $ } from './helper'

// Back/Forward support
$('#back').addEventListener('click', (event) => {
  event.preventDefault()
  history.back()
})

$('#forward').addEventListener('click', (event) => {
  event.preventDefault()
  history.forward()
})

// Minimal dropdown menu
$('.dropdown').addEventListener('click', (event) => {
  event.preventDefault()
  const target = <HTMLElement>event.target
  const parent = <HTMLDivElement>target.parentNode
  parent.classList.toggle('show')

  const expanded = Boolean(target.getAttribute('aria-expanded'))
  target.setAttribute('aria-expanded', (!expanded).toString())
  target.classList.toggle('active')
})
