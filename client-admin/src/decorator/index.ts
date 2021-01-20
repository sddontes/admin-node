import { throttle as _throttle, debounce as _debounce } from 'lodash'

/**
 * 函数节流装饰器
 * @param {number} wait 节流的毫秒
 * @param {Object} options 节流选项对象
 * [options.leading=true] (boolean): 指定调用在节流开始前。
 * [options.trailing=true] (boolean): 指定调用在节流结束后。
 */
export function throttle(wait: number): MethodDecorator;
export function throttle(target: any, name: string, descriptor: PropertyDescriptor): void;
export function throttle(targetOrWait: any, name?: string, descriptor?: PropertyDescriptor) {
  if (!name && !descriptor) {
    // @throttle(wait)
    return function(target: any, name: string, descriptor: PropertyDescriptor) {
      descriptor.value = _throttle(descriptor.value, targetOrWait, { trailing: false })
    }
  } else {
    // @throttle
    (descriptor as PropertyDescriptor).value = _throttle((descriptor as PropertyDescriptor).value, 3000, { trailing: false })
  }
}

/**
 * 函数防抖装饰器
 * @param {number} wait 需要延迟的毫秒数。
 * @param {Object} options 选项对象
 * [options.leading=false] (boolean): 指定在延迟开始前调用。
 * [options.maxWait] (number): 设置 func 允许被延迟的最大值。
 * [options.trailing=true] (boolean): 指定在延迟结束后调用。
 */
export function debounce(wait = 1000, options = {}) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {
    descriptor.value = _debounce(descriptor.value, wait, options)
  }
}
