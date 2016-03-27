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
