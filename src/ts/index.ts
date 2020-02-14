import axios from 'axios'

window.addEventListener('DOMContentLoaded', () => {
  const origin = 'https://authentication.woman.ru'
  let openedWindow: Window | null

  document.body.addEventListener('click', function (e) {
    let target = e.target as HTMLElement
    while (target !== this) {
      if (target.hasAttribute('data-auth')) {
        e.preventDefault()
        const url = origin + '/' + target.getAttribute('data-auth') + '.php'
        openedWindow = window.open(url, 'Авторизация', 'width=700,height=500,resizable=yes,scrollbars=no,status=yes')
        return
      }
      target = target.parentNode as HTMLElement
    }
  })

  window.addEventListener('message', (e) => {
    const data = e.data
    if (e.origin === origin && data.social) {
      openedWindow!.close()

      axios.post('/api/authorize/', data)
        .then(({ data }) => {
          window.auth && window.auth(data)
        })
    }
  })
})

declare global {
  interface Window {
    auth: (data: any) => void
  }
}
