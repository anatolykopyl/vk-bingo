// import useStore from '../store'

export default () => {
  // const store = useStore()

  const evtSource = new EventSource(`${process.env.VUE_APP_BACKEND}/stream`);

  function addAnswerListener(handler) {
    evtSource.addEventListener('answer', (event) => handler(JSON.parse(event.data)))
  }

  function addUserlistListener(handler) {
    evtSource.addEventListener('userlist', (event) => handler(JSON.parse(event.data)))
  }

  return { addAnswerListener, addUserlistListener }
}
