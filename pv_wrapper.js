let color_scheme = [
    '#1B9E77',
    '#D95F02'
]


async function load_struct(viewer, name, url, stride, color) {
    let source = await fetch(url)
    source = await source.text()
    let struct = pv.io.pdb(source)
    if (stride.length !== 0) {
        struct.eachResidue(function (res) {
            res.setSS(
                (['G', 'T', 'B'].includes(stride[res.index()]) ? 'C' : stride[res.index()])
            )
        })
    }
    viewer.cartoon(name, struct, {
        color: pv.color.uniform(color),
        arcDetail: 50,
        splineDetail: 20,
        radius: 0.2,
        strength: 1.0
    })
    return struct
}

function get_struct_toggler(wrapper, name) {
    return function () {
        let struct = wrapper.viewer.get(name)
        let rotation = wrapper.viewer._cam.rotation()
        let center = wrapper.viewer._cam.center()
        let zoom = wrapper.viewer._cam.zoom()
        if (struct.visible()) {
            wrapper.viewer.hide(name)
        } else {
            wrapper.viewer.show(name)
        }
        wrapper.viewer.setCamera(
            rotation,
            center,
            zoom
        )
    }
}

async function createWrapper(root_elem, stage_width, stage_height, parameters, controls_translations) {
    // cleaning stage
    while (root_elem.firstChild) {
        root_elem.removeChild(root_elem.lastChild)
    }
    let stage = document.createElement('div')
    stage.setAttribute('class', 'ngl_stage')
    root_elem.appendChild(stage)
    let controls = document.createElement('div')
    controls.setAttribute('class', 'ngl_controls')
    root_elem.appendChild(controls)
    let loader = document.createElement('div')
    loader.setAttribute('class', 'ngl_loader')
    let wrapper = {}
    wrapper.root_elem = root_elem
    wrapper.structures = parameters.structures
    wrapper.mols = []
    root_elem.appendChild(loader)
    wrapper.viewer = pv.Viewer(
        stage,
        {
            width: Math.max(root_elem.clientWidth, 400),
            height: Math.max(root_elem.clientHeight, 400),
            antialias: true,
            outline: false,
            quality : 'high',
            fog: false
        }
    )
    for (let [idx, struct] of wrapper.structures.entries()) {
        let mol = await load_struct(
            wrapper.viewer,
            struct.name,
            struct.url,
            struct.stride,
            color_scheme[idx]
        )
        wrapper.mols.push(mol)
    }
    // wrapper.viewer.autoZoom()
    wrapper.viewer.fitTo(wrapper.mols[0])
    if (wrapper.structures.length > 1) {
        wrapper.states = {}
        for (struct of wrapper.structures) {
            wrapper.states[struct['name']] = 1
            let buttn = document.createElement('button')
            buttn.setAttribute('class', 'ngl_button')
            buttn.innerText = controls_translations["toggle_"+struct['name']]
            buttn.addEventListener('click', get_struct_toggler(wrapper, struct['name']))
            controls.appendChild(buttn)
        }
    }
    loader.style.display = 'none'
}