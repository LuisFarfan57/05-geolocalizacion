const inquirer = require('inquirer')
const colors = require('colors')

const preguntas = [
    {
        type: 'list',
        //Este es el nombre de la variable que devuelve
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'3.'.green} Salir`
            },
        ]
    }
]

const inquirerMenu = async () => {
    console.clear()
    console.log('=========================='.green)
    console.log('  Seleccione una opción'.white)
    console.log('=========================='.green)

    const { opcion } = await inquirer.prompt(preguntas)

    return opcion
}

const pausa = async () => {
    const pregunta= [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ]

    console.log('\n')
    await inquirer.prompt(pregunta)
}

const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate(value) {
                if(value.length === 0)
                    return 'Por favor ingrese un valor'
                
                return true
            }
        }
    ]

    const { descripcion } = await inquirer.prompt(question)

    return descripcion
}

const listarLugares = async (lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const index = `${i + 1}`.green

        return {
            value: lugar.id,
            name: `${index}. ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: 0,
        name: `0. Cancelar`
    })

    const pregunta = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(pregunta)
    return id
}

const confirmar = async (mensaje) => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ]

    const {ok} = await inquirer.prompt(pregunta)

    return ok
}

const mostrarListadoChecklist = async (tareas = {}) => {
    const choices = Object.keys(tareas).map((key, i) => {
        const tarea = tareas[key]
        const index = `${i + 1}`.green

        return {
            value: tarea.id,
            name: `${index}. ${tarea.descripcion}`,
            checked: tarea.completadoEn ? true : false
        }
    })

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione las tareas',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta)
    return ids
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}