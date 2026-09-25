import Icon from './Icon'
import './LaunchScreen.css'

export default function LaunchScreen() {
  return (
    <div className="launch-screen" role="status" aria-label="앱 여는 중">
      <div className="launch-screen__mark" aria-hidden="true">
        <Icon name="logo" size={46} />
      </div>
      <div className="launch-screen__copy">
        <strong>까먹지말자</strong>
        <span>놓치기 전에 꺼내보기</span>
      </div>
      <span className="launch-screen__bar" aria-hidden="true" />
    </div>
  )
}
