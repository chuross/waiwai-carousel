waiwai-carousel
===============

脳筋で使えるjQueryのカルーセルプラグイン

```javascript
<script type="text/javascript">
$(document).ready(function() {
    // ulタグを指定してね
    $('.ultag').waiwaiCarousel({
        // カルーセルの幅。autoだと親要素に追従する
        width: 'auto',
        // カルーセルの高さ。autoだと親要素に追従する
        height: 'auto',
        // カルーセルの移動する向き。縦の場合はvertical
        direction: 'horizontal',
        // 押した時に次に移動させるための要素を指定できる
        next: null,
        // 押した時に前に移動させるための要素を指定できる
        prev: null,
        // カルーセルの移動時間
        animationDuration: 500,
        // 移動量
        transitionSize: 'auto',
        // 次が押された時に呼ばれるコールバック
        onNextClick: null,
        // 前が押された時に呼ばれるコールバック
        onPrevClick: null,
        // カルーセルの移動を始めた時のコールバック
        onTransitionStart: null,
        // カルーセルの移動を終えた時のコールバック
        onTransitionEnd: null
    });
});
</script>
```
