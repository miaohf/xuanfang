// import defaultSettings from '@/settings'

const title = '九色鹿抽签管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
