export interface LinkNode {
  next?: LinkNode
  prev?: LinkNode

  id: number
  before?: number
  after?: number
  first?: boolean
  last?: boolean
}

export interface List {
  readonly head?: LinkNode
  readonly tail?: LinkNode
  push: (item: LinkNode) => void
  unshift: (item: LinkNode) => void
  pushList: (list: List) => void
  unshiftList: (list: List) => void
  refresh: () => void
  toArray: () => LinkNode[]
}

export function createList(initNode?: LinkNode): List {
  let innerHead: LinkNode | undefined
  let innerTail: LinkNode | undefined

  function refreshHeadAndTail(node: LinkNode) {
    if (node.prev && node.next) {
      innerHead = node.prev
      while (innerHead.prev) {
        innerHead = innerHead?.prev
      }
      innerTail = node.next
      while (innerTail.next) {
        innerTail = innerTail?.next
      }
    } else if (node.prev) {
      innerTail = node
      innerHead = node.prev
      while (innerHead.prev) {
        innerHead = innerHead?.prev
      }
    } else if (node.next) {
      innerHead = node
      innerTail = node.next
      while (innerTail.next) {
        innerTail = innerTail?.next
      }
    }
  }
  const instance: List = {
    get head() {
      return innerHead
    },
    get tail() {
      return innerTail
    },
    push(item) {
      if (innerTail) {
        innerTail.next = item
        item.prev = innerTail
        if (!innerTail.prev && !innerHead) {
          innerHead = innerTail
        } else if (!innerTail.prev && innerHead) {
          innerTail.prev = innerHead
          innerHead.next = innerTail
        }
      }

      innerTail = item
    },
    unshift(item) {
      if (innerHead) {
        innerHead.prev = item
        item.next = innerHead
        if (!innerHead.next && !innerTail) {
          innerTail = innerHead
        } else if (!innerHead.next && innerTail) {
          innerHead.next = innerTail
          innerTail.prev = innerHead
        }
      }
      innerHead = item
    },
    pushList(list) {
      if (list.head && list.tail) {
        if (!innerHead && !innerTail) {
          innerHead = list.head
          innerTail = list.tail
        } else if (innerHead && !innerTail) {
          innerHead.next = list.head
          list.head.prev = innerHead
          innerTail = list.tail
        } else if (innerTail && !innerHead) {
          innerTail.next = list.head
          list.head.prev = innerTail
          innerHead = innerTail
          innerTail = list.tail
        } else if (innerTail && innerHead) {
          innerTail.next = list.head
          list.head.prev = innerTail
          innerTail = list.tail
        }
      } else {
        const node = list.head || list.tail
        if (node) {
          instance.push(node)
        }
      }
    },
    unshiftList(list) {
      if (list.head && list.tail) {
        if (!innerHead && !innerTail) {
          innerHead = list.head
          innerTail = list.tail
        } else if (innerHead && !innerTail) {
          innerHead.prev = list.tail
          list.tail.next = innerHead
          innerTail = innerHead
          innerHead = list.head
        } else if (innerTail && !innerHead) {
          innerTail.prev = list.tail
          list.tail.next = innerTail
          innerHead = list.head
        } else if (innerTail && innerHead) {
          innerHead.prev = list.tail
          list.tail.next = innerHead
          innerHead = list.head
        }
      } else {
        const node = list.head || list.tail
        if (node) {
          instance.unshift(node)
        }
      }
    },
    refresh() {
      if (innerHead && !innerTail) {
        refreshHeadAndTail(innerHead)
      } else if (!innerHead && innerTail) {
        refreshHeadAndTail(innerTail)
      } else {
        while (innerHead?.prev) {
          innerHead = innerHead.prev
        }

        while (innerTail?.next) {
          innerTail = innerTail.next
        }
      }
    },
    toArray() {
      const arr: LinkNode[] = []
      let currentItem = innerHead
      while (currentItem?.next) {
        const { prev, next, ...other } = currentItem
        arr.push(other)
        currentItem = next
      }
      if (currentItem) {
        const { prev, ...other } = currentItem
        arr.push(other)
      }

      return arr
    },
  }
  if (initNode && !initNode.next && !initNode.prev) {
    instance.unshift(initNode)
  } else if (initNode) {
    refreshHeadAndTail(initNode)
    if (innerHead && innerHead === innerTail) {
      innerTail = undefined
      innerHead.next = undefined
      innerHead.prev = undefined
    }
  }
  return instance
}

export function isList(node: LinkNode) {
  return !!(node.prev || node.next)
}

export function getItemById(inputArr: LinkNode[], id: number) {
  for (const item of inputArr) {
    if (item.id === id) {
      return item
    }
  }
}

export function addItemBeforeId(inputArr: LinkNode[], inputItem: LinkNode, beforeId: number) {
  const targetItem = getItemById(inputArr, beforeId)
  if (!targetItem) return
  const tmpPrev = targetItem.prev
  inputItem.next = targetItem
  targetItem.prev = inputItem
  if (tmpPrev) {
    tmpPrev.next = inputItem
    inputItem.prev = tmpPrev
  }
  return targetItem
}
export function addItemAfterId(inputArr: LinkNode[], inputItem: LinkNode, afterId: number) {
  const targetItem = getItemById(inputArr, afterId)
  if (!targetItem) return
  const tmpNext = targetItem.next
  inputItem.prev = targetItem
  targetItem.next = inputItem
  if (tmpNext) {
    tmpNext.prev = inputItem
    inputItem.next = tmpNext
  }
  return targetItem
}

export function createOrderList(inputArr: LinkNode[]) {
  const headList = createList()
  const tailList = createList()
  const currentList = createList()

  inputArr.forEach((item) => {
    if (item.first) {
      if (isList(item)) {
        const list = createList(item)
        headList.unshiftList(list)
      } else {
        headList.unshift(item)
      }
      return
    }

    if (item.last) {
      if (isList(item)) {
        const list = createList(item)
        tailList.pushList(list)
      } else {
        tailList.push(item)
      }
      return
    }

    if (item.before) {
      const tItem = addItemBeforeId(inputArr, item, item.before)
      if (tItem?.first) {
        headList.refresh()
      } else if (tItem?.last) {
        tailList.refresh()
      } else {
        currentList.refresh()
      }
      return
    }
    if (item.after) {
      const tItem = addItemAfterId(inputArr, item, item.after)
      if (tItem?.first) {
        headList.refresh()
      } else if (tItem?.last) {
        tailList.refresh()
      } else {
        currentList.refresh()
      }
      return
    }

    if (isList(item)) {
      const list = createList(item)
      currentList.pushList(list)
    } else {
      currentList.push(item)
    }
  })

  return {
    toArray() {
      const list = createList()
      list.pushList(headList)
      list.pushList(currentList)
      list.pushList(tailList)
      return list.toArray()
    },
  }
}
