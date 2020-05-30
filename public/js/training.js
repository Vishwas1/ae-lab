

const loadtraining = async () => {
    const url = `${host}/trainingContent?id=bfc`;
    const resp = await fetch(url);    
    const json = await resp.json();
    const data =  JSON.parse(json.data);
    console.log(data);

    let html = "";
    data.syllabus.forEach(x => {
        let topicHtml = '<ul>'
        x.topics.forEach(y => {
            topicHtml += `
                <li>
                    <a id="${x.chId}-${y.tid}" href="#" youtube-link="${y.url}" onclick="showVideo(this)">${y.title}</a>
                </li>
            `
        })
        topicHtml += '</ul>'
        let isCollapsed = 'collapse-body collapse'
        if(x.chId.indexOf('-1') > -1) isCollapsed = 'collapse-body'
        html += `
            <div class="collapse-header" data-toggle="collapse" data-target="#${x.chId}"><i class="fa fa-plus fa-1x"></i> ${x.chId.replace('ch','#')} | ${x.title}</div>
            <div class ="${isCollapsed}" id="${x.chId}" class="collapse">${topicHtml}</div>
        `
    })

    console.log(html)
    $('#training_syllabus').html(html)
    const firstelm = document.getElementById('ch-1-1')
    showVideo(firstelm)

}

const showVideo = (elm) => {
    debugger
    const link = elm.getAttribute("youtube-link") 
    let html = `
        <iframe class="iframe" src="${link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
    $('#training_vid').html(html)

}
$(document).ready(function () {
    loadtraining();
});


