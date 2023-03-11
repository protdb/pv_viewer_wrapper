# PV_Viewer Wrapper

Wrapper для альтернативного просмотрщика PDB структур на сайте

Встраивается следующим образом:

В `<head>` добавляются два скрипта:

```html
<script src="bio-pv.js"></script>
<script src="pv_wrapper.js"></script>
```

Далее в HTML создается `<div>`, который будет служить контейнером. Без параметров и в общем-то без стилей.

После этого div'а выполняется следующий скрипт:

```js
    async function loadViewer() {
        await createWrapper(
            document.getElementById("pv_container"),
            800,
            800,
            data,
            {
                "toggle_reference": "Toggle reference",
                "toggle_result": "Toggle result"
            }
        )
    }
    loadViewer()
```

Параметры вызова `createWrapper()`:

- Элемент контейнера
- высота сцены для просмотра
- ширина сцены для просмотра
- data: структура данных, на основе которой должен быть отрисован плеер
- словарь для перевода кнопок.

Кнопки появляются только если передано > 1 структуры

## Формат данных для вывода:

```json
{
  "structures": [
    {
      "name": "reference",
      "url": "examples/2KO3_A.pdb",
      "stride": "CEEEEETTTTCEEEEECTTTTBHHHHHHHHHHHHCCCGGGCEEEETTEECTTTTBGGGGCCTTTTEEEEEECCCCC"
    },
    {
      "name": "result",
      "url": "examples/2C9W_B2_B77.pdb",
      "stride": "CEEEEEEETTEEEEEEETTTTBHHHHHHHHHHHHCCCGGGEEEEETTEEETTTTBGGGGCCTTTTTBTTBTEEEEE"
    }
  ]
}
```

Содержат массив structures, в котором указываются три поля:
- name: название
- url: ссылка на pdb-файл
- stride: строка вторичной структуры, необъодима этому плееру.