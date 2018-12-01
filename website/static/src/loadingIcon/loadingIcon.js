function loadingIcon(self=null) {
    var loadingtimes = 0;
    self = self || 'body';
    var loadingImg = d3.select(self).selectAll('div#OVERLAY').data([1])
            .enter()
            .append('div')
            .attr('id', '#OVERLAY')
            .style('width', '100%')
            .style('height', '100%')
            .style('left', 0)
            .style('top', 0)
            .style('display', 'none')
            .style('position', 'absolute')
            .style('background-color', 'rgba(153, 153, 153, 0.4)')
            .style('z-index', 100);
    loadingImg.append('div')
        .attr('class', 'loading-panel')
        .style('display', 'block')
        .style('position', 'absolute')
        .style('top', '40%')
        .style('left', '49.5%')
        .style("height", "20%")
        .style("max-width", "100px")
        .style("max-height", "100px")
        .style('z-index', '500');
    loadingImg.select('div.loading-panel')
        .append('img')
        .style("height", "100%")
        .attr('src', './static/src/images/loadingAnimation.gif')


    var startLoading = function() {
        if ((++loadingtimes) > 0) {
            loadingImg.style('display', 'block');
        }
    };
    var endLoading = function() {
        if ((--loadingtimes) === 0) {
            loadingImg.style('display', 'none');
        }
    };
    return [startLoading, endLoading];
}
