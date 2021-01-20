// Parse the time to string
export const parseTime = (
  time?: object | string | number | null,
  cFormat?: string
): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

/**
 * 生成树形全站资源
 * @param {Array} menus
 * @returns {Array}
 */
export const generateAllRoutesTree = (menus: any[]) => {
  const res = []
  for (const menu of menus) {
    if (!(menu.parentId === 0 && menu.children && menu.children.length < 1)) {
      const children: object[] = []
      menu.operableList = []
      menu.operationList = []
      menu.children && menu.children.map((child: any) => {
        if (child.type === 2) {
          menu.operationList.push(child)
        } else {
          children.push(child)
        }
      })
      if (children.length > 0) {
        menu.children = generateAllRoutesTree(children)
      } else {
        menu.children = []
      }
      res.push(menu)
    }
  }
  return res
}

/**
 * 生成树形角色权限
 * @param {Array} menus
 * @returns {Array}
 */
export const generateRoleRoutesTree = (menus: any[]) => {
  const res = []
  for (const menu of menus) {
    if (!(menu.parentId === 0 && menu.children.length < 1)) {
      const children: any[] = []
      menu.operableList = []
      menu.children && menu.children.map((child: any) => {
        if (child.type === 2) {
          menu.operableList.push(child)
        } else {
          children.push(child)
        }
      })
      if (children.length > 0) {
        menu.children = generateRoleRoutesTree(children)
      } else {
        menu.children = []
      }
      res.push(menu)
    }
  }
  return res
}

/**
 * 树形数组转一维数组
 * @param {Array} menus
 * @returns {Array}
 */
export const generateArrByTree = (tree: any[]) => {
  let data:object[] = []
  tree.map((t: any) => {
    data.push(t)
    if (t.children) {
      const temp = generateArrByTree(t.children)
      if (temp.length > 0) {
        data = [...data, ...temp]
      }
    }
  })
  return data
}

/**
 * 返回当前页权限对象
 * @param {Array} 权限列表
 * @returns {Object}
 */
export function getPower(operableList: any[]) {
  const power: any = {}
  operableList && operableList.map((item: any) => { power[item.auth.slice(1)] = item })
  return power
}
