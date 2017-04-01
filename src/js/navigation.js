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
  event.target.parentNode.classList.toggle('show')

  const expanded = Boolean(event.target.getAttribute('aria-expanded'))
  event.target.setAttribute('aria-expanded', (!expanded).toString())
  event.target.classList.toggle('active')
})
