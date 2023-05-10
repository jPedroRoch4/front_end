$(document).ready(myView)

function myView() {
    // constante que contém o id do artigo.
    const articleId = parseInt(sessionStorage.article)

    if (isNaN(articleId)) loadpage('e404')
    // busca os artigos do usuário na API
    $.get(app.apiBaseURL + 'articles', { id: articleId, status: 'on' })


        .done((data) => {
// Caso venham artigos diferentes de 1 id epecífico, gera a página de erro.
            if (data.length != 1) loadpage('e404')
            // artData armazena um artigo presente em data
            artData = data[0]
            $('#artTitle').html(artData.title)
            $('#artContent').html(artData.content)
            // Faz a atualizações de views.
            updateViews(artData)
            // Muda o nome da página.
            changeTitle(artData.title)
            //Obtém os dados do autor.
            getAuthorData(artData)
            // Obtém os artigos do autor.
            getAuthorArticles(artData, 5)
            // Gera um formulário para o usuário caso esteja logado.
            getUserCommentForm(artData)
            // Pega todos os comentários do artigo.
            getArticleComments(artData, 999)
        })

        .fail((error) => {
            // Caso não tenha artigos, carrega um PopUp e a página de erro.
            popUp({ type: 'error', text: 'Artigo não encontrado!' })
            loadpage('e404')
        })

}
// Obtém os dados do autor. 
function getAuthorData(artData) {
    $.get(app.apiBaseURL + 'users/' + artData.author)
        .done((userData) => {

            // Pega as redes sociais do usuário usando o banco de dados do Google e cria um link para a rede social.
            var socialList = ''
            if (Object.keys(userData.social).length > 0) {
                socialList = '<ul class="social-list">'
                for (const social in userData.social) {
                    socialList += `<li><a href="${userData.social[social]}" target="_blank">${social}</a></li>`
                }
                socialList += '</ul>'
            }
            // Obtém os dados específicos do autor, através dp login social.
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)
            $('#artAuthor').html(`
                <img src="${userData.photo}" alt="${userData.name}">
                <h3>${userData.name}</h3>
                <h5>${getAge(userData.birth)} anos</h5>
                <p>${userData.bio}</p>
                ${socialList}
            `)
        })
        // Caso o usuário não tenha login.
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })
}
// Pega os artigos do autor.
function getAuthorArticles(artData, limit) {
 // Busca os artigos na API 
    $.get(app.apiBaseURL + 'articles', {

        author: artData.author,
// Artigos cujo o status seja ON.
        status: 'on',

        id_ne: artData.id,
        // limite de artigos
        _limit: limit
    })
        .done((artsData) => {
            if (artsData.length > 0) {
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                var rndData = artsData.sort(() => Math.random() - 0.5)
                rndData.forEach((artItem) => {
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>`
                });
                output += '</ul>'
                $('#authorArtcicles').html(output)
            }
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}
// Pega todos os comentários do artigo.
function getArticleComments(artData, limit) {

    var commentList = ''

    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit
    })
        .done((cmtData) => {
            if (cmtData.length > 0) {
                cmtData.forEach((cmt) => {
                    var content = cmt.content.split("\n").join("<br>")
                    commentList += `
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            $('#commentList').html(commentList)
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}
// Gera um formulário para o usuário caso esteja logado.
function getUserCommentForm(artData) {

    var cmtForm = ''

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent">Comentário fake para testes</textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            $('#commentForm').html(cmtForm)
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
        } else {
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`
            $('#commentForm').html(cmtForm)
        }
    })

}
// Envia o comentário usando os dados.
function sendComment(event, artData, userData) {

    event.preventDefault()
    var content = stripHtml($('#txtContent').val().trim())
    $('#txtContent').val(content)
    if (content == '') return false

    const today = new Date()
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]

    // Busca na API os comentários deste artigo
    $.get(app.apiBaseURL + 'comments', {
        uid: userData.uid,
        content: content,
        article: artData.id
    })
        .done((data) => {
            if (data.length > 0) {
                // Cria um PopUp e indica quando um comentário com a mesma mensagem já foi enviado.
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } else {

                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    content: content,
                    date: sysdate,
                    status: 'on'
                }

                $.post(app.apiBaseURL + 'comments', formData)
                    .done((data) => {
                        if (data.id > 0) {
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' })
                            loadpage('view')
                        }
                    })
                    .fail((err) => {
                        console.error(err)
                    })

            }
        })

}
// Função que atualiza a contagem de views.
function updateViews(artData) {
    // Jquary faz uma requisição 
    $.ajax({
        type: 'PATCH',
        url: app.apiBaseURL + 'articles/' + artData.id,
        data: { views: parseInt(artData.views) + 1 }
    });
}