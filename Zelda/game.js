kaboom({
    global: true,
    fullscreen: true,
     scale: 1,
     debug: true,
});

const MOVE_SPEED = 120

loadRoot('https://i.imgur.com/')
loadSprite('link-going-left', '5W5Ne79.png')
loadSprite('link-going-right', 'qOArOKs.png')
loadSprite('link-going-down', 'MMXNA1p.png')
loadSprite('link-going-up', 'ty4bAQ5.png')
loadSprite('left-wall', 'YNMCeoJ.png')
loadSprite('top-wall', 'ffUY2YA.png')
loadSprite('bottom-wall', '4BvmVsi.png')
loadSprite('right-wall', 'vswS2Dk.png')
loadSprite('bottom-right-wall', 'gsWHgEJ.png')
loadSprite('bottom-left-wall', 'TyrE1tJ.png')
loadSprite('top-right-wall', 'xvjALqg.jpg')
loadSprite('top-left-wall', 'v8XdIAr.png')
loadSprite('top-door', '8Y2fxl9.png')
loadSprite('fire-pot', '0cItVV8.png')
loadSprite('left-door', 'lO1cg6g.png')
loadSprite('lanterns', '8HSr4uf.png')
loadSprite('slicer', '0lek1JH.png')
loadSprite('skeletor', 'iOPMg2u.png')
loadSprite('kaboom', 'qsM0r8s.png')
loadSprite('stairs', 'sF6XXcX.png')
loadSprite('bg', 'bQPVsoh.png')


scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [
            'yccccccccc)ccccccccc)cccc^ccccw',
            'a                      (      b',
            'a     *                       b',
            'a                             b',
            'a      (                      b',
            'a                 *           b',
            '%                             b',
            'a                             b',
            'a        *                    b',
            'a                             b',
            'a                             b',
            'a                     (       b',
            'a                             b',
            'zddddddddd)ddddddddd)dddddddddx',
        ],
        [
            'ycccccccccccccccccccccccccccccw',
            'a                             b',
            'a                             b',
            'a                             b',
            'a                   }         )',
            'a     }                       b',
            '%          $                  b',
            'a                             b',
            'a                             b',
            'a                             b',
            'a              }              )',
            'a                             b',
            'a                             b',
            'zddddddddd)ddddddddd)dddddddddx',
        ],
    ]

    const levelCfg = {
        width: 48,
        height: 48,
        'a': [sprite('left-wall'), solid(), 'wall'],
        'b': [sprite('right-wall'), solid(), 'wall'],
        'c': [sprite('top-wall'), solid(), 'wall'],
        'd': [sprite('bottom-wall'), solid(), 'wall'],
        'w': [sprite('top-right-wall'), solid(), 'wall'],
        'x': [sprite('bottom-right-wall'), solid(), 'wall'],
        'y': [sprite('top-left-wall'), solid(), 'wall'],
        'z': [sprite('bottom-left-wall'), solid(), 'wall'],
        '%': [sprite('left-door'), solid()],
        '^': [sprite('top-door'), 'next-level'],
        '$': [sprite('stairs'), 'next-level'],
        '*': [sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous'],
        '}': [sprite('skeletor'), 'dangerous', 'skeletor', { dir: -1 }],
        ')': [sprite('lanterns'), solid()],
        '(': [sprite('fire-pot'), solid()],
    }
    addLevel(maps[level], levelCfg)

    // add ([sprite('bg'), layer('bg')])
    
    const scoreLabel = add([
        text ('No Score'),
        pos(1000,680),
        layer('ui'),
        {
            value: score,
        },
        scale(2)
    ])

    add([text('level ' + parseInt(level + 1)), pos(1000,700), scale(2)])

    const player = add([
        sprite('link-going-right'),
        pos(5, 260),
        {
            //right by default
            dir: vec2(1,0),
        }
    ])

    player.action(() => {
        player.resolve()
    })

    player.overlaps('next-level', () => {
        go("game", {
            level: (level + 1) % maps.length,
            score: scoreLabel.value
        })

    })

    keyDown('left', () => {
        player.changeSprite('link-going-left')
        player.move(-MOVE_SPEED,0)
        player.dir = vec2(-1,0)
    })

    keyDown('right', () => {
        player.changeSprite('link-going-right')
        player.move(MOVE_SPEED,0)
        player.dir = vec2(1,0)
    })

    keyDown('up', () => {
        player.changeSprite('link-going-up')
        player.move(0, -MOVE_SPEED)
        player.dir = vec2(0,-1)
    })

    keyDown('down', () => {
        player.changeSprite('link-going-down')
        player.move(0, MOVE_SPEED)
        player.dir = vec2(0,1)
    })

    const SLICER_SPEED = 100

    action('slicer', (s) => {
        s.move(s.dir * SLICER_SPEED, 0)
    })

    collides('slicer', 'wall', (s) => {
        s.dir = -s.dir
    })

    const SKELETOR_SPEED = 60

    action('skeletor', (s) => {
        s.move(0, s.dir * SKELETOR_SPEED)
        s.timer
    })

    collides('skeletor', 'wall', (s) => {
        s.dir = -s.dir
    })

    player.overlaps('dangerous', () => {
        go('lose', { score: scoreLabel.value})
    })
})

scene("lose", ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2), height() /2])
})

start("game", { level: 0, score: 0})