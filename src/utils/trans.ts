// 传入整体数据和依赖数组
export function test(data, root, require) {
  // [1, 10, 96, 99, 88],
  let temp = root
  require.forEach(item => {
    // data[1] data[10] data[96].......
    temp.children.push(data[item])
    if (data[item].requiring) {
      test(data, data[item], data[item].requiring)
    }
  })
  return temp
}

export function emit(data){




}
