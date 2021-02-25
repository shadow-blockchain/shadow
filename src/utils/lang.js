import { BehaviorSubject, Subject } from 'rxjs';

const langOB = new Subject()
const lang = new BehaviorSubject({})

export function init() {
    langOB.subscribe(v => {
        const langPack = require(`../lang/${v}.js`)
        langPack && langPack.default && lang.next(langPack.default)
    } )
    langOB.next("zh")
}


export function setLocal(lang) {
    langOB.next(lang)
}

export function getMessage(callback) {
    const s = lang.subscribe(x => {
        callback instanceof Function && callback(x)
    })
    return s
}