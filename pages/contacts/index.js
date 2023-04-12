$(document).ready(myContacts)

/**
 * Função principal da página "contacts".
 **/
function myContacts() {
    /**
     * Altera o título da página quando 'contacts' for acessada.
     **/
    changeTitle('Faça contato')

    $(document).on('submit', '#cForm', sendContact)

}

function sendContact(ev) {

    var formJSON = {}

    const formData = new FormData(ev.target);

    for (const [key, value] of formData) {
        formJSON[key] = value
    }

    formJSON = formJSON.stringfy(formJSON)

    console.log(formJSON)


    return false



}