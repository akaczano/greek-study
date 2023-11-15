import { checkEnglish } from "./grader"


test('test definition matches', () => {
    let expected = 'to go, proceed, travel; live, walk'
    let actual = 'to walk, live; travel, go, proceed'    
    let result = checkEnglish(expected, actual)
    expect(result).toBe(true)
})