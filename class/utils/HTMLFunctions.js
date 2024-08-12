/**
 * Represent functions for interacting with index.html
 * @class
 */
export class HTMLFunctions {
    /**
     * Fetch static html content to insert in index.html
     * returns promise to ensure all scripts loaded before app.js runs
     * @method
     * @static
     * @param {string} filename
     * @param {string} queryDiv
     * @param {string} insertLocation
     * @returns {Promise}
     */
    static fetchStaticHtmlString(filename, queryDiv, insertLocation) {
        return new Promise((resolve, reject) => {
            const filePath = `../views/${filename}`
            const request = new XMLHttpRequest()
            request.open('GET', filePath, true)
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const tempDiv = document.createElement('div')
                        tempDiv.innerHTML = request.responseText.trim()
                        document.querySelector(queryDiv).insertAdjacentElement(insertLocation, tempDiv.firstChild)
                        resolve()
                    } else { reject(`Failed to load ${filename}: ${request.statusText}`) }
                }
            }
            request.onerror = () => reject(`Network error while trying to load ${filename}`)
            request.send()
        })
    }

    /**
     * Fetch html content to be dynamically inserted in index.html
     * @method
     * @static
     * @param {string} filename
     * @param {function} handler callback function
     */
    static fetchDynamicHtmlString(filename, handler) {
        const filePath = `../views/${filename}`
        const request = new XMLHttpRequest()
        request.open('GET', filePath, true)
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) { handler(request.responseText) }
        }
        request.send()
    }
}
