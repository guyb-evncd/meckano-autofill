/**
1. Go to your current monthly report: https://app.meckano.co.il/#report/21-06-2022/20-07-2022
2. Inject this script into the page
3. Run `await fillMonth()`
4. Watch the script filling your entire missing non-rest days with 9:00-18:00 values
*/

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
  
  async function waitFor(selector, parent = document) {
    let attempts = 10
    while (attempts > 0) {
      const element = parent.querySelector(selector)
      if (element) {
        return element
      }
      await sleep(50)
      attempts--
    }
    throw new Error(`Could not find ${selector}`)
  }
  
  function getNonRestDays() {
    return document.querySelectorAll('table.employee-report > tbody > tr[data-report_data_id]:not(.highlightingRestDays)')
  }
  
  function getMissingDays(nonRestDays) {
    return Array.from(nonRestDays).filter(tr => tr.querySelector('.missing').innerText === '+')
  }
  
  async function submitHours(day) {
    day.querySelector('a.insert-row').click()
    const insertRow = await waitFor('tr.insert-row')
    insertRow.querySelector('input.checkin-str').value = '09:00'
    insertRow.querySelector('input.checkout-str').value = '18:00'
    insertRow.querySelector('button.inline-confirm').click()
    await sleep(1000)
  }
  
  async function fillMonth() {
    let nonRestDays = getNonRestDays()
    let missingDays = getMissingDays(nonRestDays)
    while (missingDays.length > 0) {
      await submitHours(missingDays[0])
      nonRestDays = getNonRestDays()
      missingDays = getMissingDays(nonRestDays)
    }
  }
  