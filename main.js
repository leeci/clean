Vue.config.productionTip = false

new Vue({
  el: '#app',
  data: {
    s: '',
    t: ''
  },
  methods: {
    tbl: function () {
      var data = this.s.split('\n')
      var max = 0
      var table = ''
      var suit = {}

      for (var key in data) {
        if (data[key] === '') {
          data.splice(key)
          continue
        }

        data[key] = data[key].split('\t')

        var num = parseInt(data[key][0])

        if (num > max) {
          max = num
        }
      }

      var half = parseInt(max / 2)

      for (var key in data) {
        var num =  parseInt(data[key][0])
        var pb = data[key][3]
        var lump = data[key][4]
        var pv = data[key][5]
        var sv = data[key][6]

        if (typeof suit[num] === 'undefined') {
          suit[num] = {}
        }

        if (lump !== '' && pb === '' && pv === '' && sv === '') {
          var sp = lump.split('=')
          suit[num].title = sp[0] + '/' + sp[1]
        }

        if (lump === '' && pb !== '' && pv === '' && sv === '') {
          suit[num].pb = pb
        }

        if (pv !== '' && sv !== '' && lump === '' && pb === '') {
          suit[num].pv = pv
          suit[num].sv = [sv]
        }

        if (sv !== '' && pv === '' && lump === '' && pb === '') {
          suit[num].sv.push(sv)
        }
      }


      table = `
<table style="width:100%;">
  <tr><td>`
        for (var key in suit) {
          if (key == 1 || key == half + 1) {
              table += `
    <table class="table">
      <tbody>
        <tr>
          <th style="width: 350px;"></th>
          <th style="width: 80px;">{{$t('title.unit')}}</th>
          <th style="width: 80px;">{{$t('title.pv')}}</th>
          <th style="width: 80px;">{{$t('title.sv')}}</th>
        </tr>`
          }
          var title = typeof suit[key].title !== 'undefined' ? `<opcx cid="${suit[key].title}"></opcx>`:''
          var unit = `Sec`
          var pv = typeof suit[key].pv !== 'undefined' ? `<opcx cid="${suit[key].pv}"></opcx>`:''
          var sv = ''
          var pb = typeof suit[key].pb !== 'undefined' ? `<opcx cid="${suit[key].pb}"></opcx>`:''

          if (suit[key].sv instanceof Array) {
            for (var index in suit[key].sv) {
              sv += `<opcx cid="${suit[key].sv[index]}"></opcx>
`
            }
          }

          if (pb === '') {
            table +=`
            <tr>
              <td>${title}</td>
              <td>${unit}</td>
              <td>${pv}</td>
              <td>${sv}</td>
            </tr>`
          } else {
            table +=`
            <tr>
              <td>${title}</td>
              <td></td>
              <td colspan="2">${pb}</td>
            </tr>`
          }

          if (key == half) {
            table += `</tbody></table></td><td>`
          } else if (key == max) {
            table += `</tbody></table>`
          }
        }
      table += `</td></tr></table>`
      this.t = table
    }
  }
})
