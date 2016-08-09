// TODO: pick better colors
var colors = [
  '#ffb47d',
  '#ff8a7d',
  '#ffe67d',
  '#b9f480',
  '#86ead3',
  '#86abea',
  '#a886ea',
  '#ea86e5',
]

export default function(userId) {
  var num = userId.charCodeAt(0);
  num += userId.charCodeAt(1);
  num += userId.charCodeAt(2);

  return colors[num % colors.length];
}
