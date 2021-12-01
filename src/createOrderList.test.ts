import {
  addItemAfterId, addItemBeforeId, createList, createOrderList, isList, LinkNode
} from './createOrderList';

describe('createList push method', () => {
  test('push', () => {
    const list = createList()
    const item1: LinkNode = {
      id: 1,
    }
    list.push(item1)
    expect(list.tail).toBe(item1)
    const item2: LinkNode = {
      id: 3,
    }
    list.push(item2)
    expect(list.tail).toBe(item2)
    expect(list.head).toBe(item1)

    const item3: LinkNode = {
      id: 4,
    }
    list.push(item3)
    expect(list.tail).toBe(item3)
    expect(list.tail?.prev).toBe(item2)
  })

  test('push list with only head', () => {
    const list1 = createList({
      id: 1,
    })
    const list2 = createList()
    list2.pushList(list1)
    expect(list2.tail).toBe(list1.head)
  })

  test('push list with only tail', () => {
    const list1 = createList()
    list1.push({
      id: 1,
    })
    const list2 = createList()
    list2.pushList(list1)
    expect(list2.tail).toBe(list1.tail)
  })

  test('push list when list is empty', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList()
    list2.pushList(list1)
    expect(list2.tail).toBe(list1.tail)
    expect(list2.head).toBe(list1.head)
  })
  test('push list when list only has head', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList({
      id: 3,
    })
    list2.pushList(list1)
    expect(list2.head?.id).toBe(3)
    expect(list2.tail?.id).toBe(2)
  })
  test('push list when list only has tail', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList()
    list2.push({
      id: 3,
    })
    list2.pushList(list1)
    expect(list2.head?.id).toBe(3)
    expect(list2.tail?.id).toBe(2)
  })
})
describe('createList with init node', () => {
  test('length 5 node list', () => {
    const list = createList()
    list.push({
      id: 1,
    })
    list.push({
      id: 2,
    })
    list.push({
      id: 3,
    })
    list.push({
      id: 4,
    })
    list.push({
      id: 5,
    })

    const list1 = createList(list.head?.next?.next)
    expect(list.head).toBe(list1.head)
    expect(list.tail).toBe(list1.tail)
  })
})

describe('createList unshift method', () => {
  test('unshift', () => {
    const list = createList()
    const item1: LinkNode = {
      id: 1,
    }
    list.unshift(item1)
    expect(list.head).toBe(item1)
    const item2: LinkNode = {
      id: 3,
    }
    list.unshift(item2)
    expect(list.head).toBe(item2)
    expect(list.tail).toBe(item1)

    const item3: LinkNode = {
      id: 4,
    }
    list.unshift(item3)
    expect(list.head).toBe(item3)
    expect(list.head?.next).toBe(item2)
  })

  test('unshift list with only head', () => {
    const list1 = createList({
      id: 1,
    })
    const list2 = createList()
    list2.unshiftList(list1)
    expect(list2.head).toBe(list1.head)
  })

  test('unshift list with only tail', () => {
    const list1 = createList()
    list1.push({
      id: 1,
    })
    const list2 = createList()
    list2.unshiftList(list1)
    expect(list2.head).toBe(list1.tail)
  })

  test('unshift list when list is empty', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList()
    list2.unshiftList(list1)
    expect(list2.tail).toBe(list1.tail)
    expect(list2.head).toBe(list1.head)
  })

  test('unshift list when list only has head', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList({
      id: 3,
    })
    list2.unshiftList(list1)
    expect(list2.head?.id).toBe(1)
    expect(list2.tail?.id).toBe(3)
  })
  test('unshift list when list only has tail', () => {
    const list1 = createList({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    const list2 = createList({
      id: 3,
    })
    list2.unshiftList(list1)
    expect(list2.head?.id).toBe(1)
    expect(list2.tail?.id).toBe(3)
  })
  test('unshift list', () => {
    const list1 = createList()
    list1.push({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    list1.push({
      id: 3,
    })
    list1.push({
      id: 4,
    })
    const list2 = createList()
    list2.push({
      id: 5,
    })
    list2.push({
      id: 6,
    })
    list2.push({
      id: 7,
    })
    list2.push({
      id: 8,
    })
    list2.unshiftList(list1)
    expect(list2.head?.id).toBe(1)
    expect(list2.tail?.id).toBe(8)
  })
})

describe('create list with node', () => {
  test('init node is tail', () => {
    const list1 = createList()
    list1.push({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    list1.push({
      id: 3,
    })

    const list2 = createList(list1.tail)
    expect(list2.head?.id).toBe(1)
    expect(list2.tail?.id).toBe(3)
  })

  test('init node is head', () => {
    const list1 = createList()
    list1.push({
      id: 1,
    })
    list1.push({
      id: 2,
    })
    list1.push({
      id: 3,
    })

    const list2 = createList(list1.head)
    expect(list2.head?.id).toBe(1)
    expect(list2.tail?.id).toBe(3)
  })
})

describe('isList', () => {
  test('case 1', () => {
    const node1: LinkNode = {
      id: 1,
    }
    const node2: LinkNode = {
      id: 3,
    }
    const node3: LinkNode = {
      id: 3,
    }
    node2.prev = node3
    node3.next = node2
    expect(isList(node1)).toBe(false)
    expect(isList(node2)).toBe(true)
  })
})

describe('addItemBeforeId', () => {
  test('case 1', () => {
    const inputArr: LinkNode[] = [{ id: 1 }, { id: 2, before: 1 }, { id: 3, before: 1 }]
    addItemBeforeId(inputArr, inputArr[1], 1)
    expect(inputArr[0].prev).toBe(inputArr[1])
    addItemBeforeId(inputArr, inputArr[2], 1)
    expect(inputArr[1].next).toBe(inputArr[2])
  })
})

describe('addItemAfterId', () => {
  test('case 1', () => {
    const inputArr: LinkNode[] = [{ id: 1 }, { id: 2, before: 1 }, { id: 3, before: 1 }]
    addItemAfterId(inputArr, inputArr[1], 1)
    expect(inputArr[0].next).toBe(inputArr[1])
    addItemAfterId(inputArr, inputArr[2], 1)
    expect(inputArr[1].prev).toBe(inputArr[2])
  })
})

describe('createOrderList', () => {
  test('case 1', () => {
    const list = createOrderList([
      { id: 1 },
      { id: 2, before: 1 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 3, after: 1 }, // 这里 after 的意思是自己要排在 id 为 1 元素后面
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 }, // 这里 after 的意思是自己要排在 id 为 8 元素后面
      { id: 8 },
      { id: 9 },
    ])
    const result = list.toArray().map((item) => item.id)
    expect(result).toEqual([5, 2, 1, 3, 8, 7, 9, 6])
  })
  test('case 2', () => {
    const list = createOrderList([
      { id: 1 },
      { id: 2, before: 1 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 21, before: 1 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 3, after: 1 }, // 这里 after 的意思是自己要排在 id 为 1 元素后面
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 }, // 这里 after 的意思是自己要排在 id 为 8 元素后面
      { id: 8 },
      { id: 9 },
    ])
    const result = list.toArray().map((item) => item.id)
    expect(result).toEqual([5, 2, 21, 1, 3, 8, 7, 9, 6])
  })
  test('case 3', () => {
    const list = createOrderList([
      { id: 1 },
      { id: 2, before: 1 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 21, before: 6 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 3, after: 1 }, // 这里 after 的意思是自己要排在 id 为 1 元素后面
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 }, // 这里 after 的意思是自己要排在 id 为 8 元素后面
      { id: 8 },
      { id: 9 },
    ])
    const result = list.toArray().map((item) => item.id)
    expect(result).toEqual([5, 2, 1, 3, 8, 7, 9, 21, 6])
  })
  test('case 4', () => {
    const list = createOrderList([
      { id: 1 },
      { id: 2, before: 1 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 21, before: 5 }, // 这里 before 的意思是自己要排在 id 为 1 的元素前面
      { id: 3, after: 1 }, // 这里 after 的意思是自己要排在 id 为 1 元素后面
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 }, // 这里 after 的意思是自己要排在 id 为 8 元素后面
      { id: 8 },
      { id: 9 },
    ])
    const result = list.toArray().map((item) => item.id)
    expect(result).toEqual([21, 5, 2, 1, 3, 8, 7, 9, 6])
  })
})
