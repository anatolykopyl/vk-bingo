// import useStore from '../store'

export default () => {
  // const store = useStore()

  const evtSource = new EventSource(`${import.meta.env.VITE_APP_BACKEND}/stream`);

  function addAnswerListener(handler) {
    evtSource.addEventListener('answer', (event) => handler(JSON.parse(event.data)))
  }

  function addUserlistListener(handler) {
    evtSource.addEventListener('userlist', (event) => handler(JSON.parse(event.data)))
  }

  function addRevealListener(handler) {
    evtSource.addEventListener('reveal', (event) => handler(JSON.parse(event.data)))
  }

  function addEndListener(handler) {
    evtSource.addEventListener('end', (event) => handler(JSON.parse(event.data)))
  }

  return { addAnswerListener, addUserlistListener, addRevealListener, addEndListener }
}
