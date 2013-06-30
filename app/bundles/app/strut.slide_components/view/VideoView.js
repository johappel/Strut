define(["./ComponentView", './Mixers'], function(ComponentView, Mixers) {
    var Html5, Youtube, result, types;
    Html5 = ComponentView.extend({
      className: "component videoView",
      initialize: function() {
        return ComponentView.prototype.initialize.apply(this, arguments);
      },
      _finishRender: function($video) {
        this.origSize = {
          width: $video[0].videoWidth,
          height: $video[0].videoHeight
        };
        return this._setUpdatedTransform();
      },
      render: function() {
        var $video,
          _this = this;
        ComponentView.prototype.render.call(this);
        $video = $("<video controls></video>");
        $video.append("<source preload='metadata' src='" + (this.model.get("src")) + "' type='" + (this.model.get("srcType")) + "' />");
        $video.bind("loadedmetadata", function() {
          return _this._finishRender($video);
        });
        this.$el.find(".content").append($video);
        return this.$el;
      }
    });
    Youtube = ComponentView.extend({
      className: 'component videoView',
      initialize: function() {
        ComponentView.prototype.initialize.apply(this, arguments);
        this.scale = Mixers.scaleObjectEmbed;
        this.model.off("change:scale", this._setUpdatedTransform, this);
        this.model.on("change:scale", Mixers.scaleChangeObjectEmbed, this);
      },
      render: function() {
        var object, scale;
        ComponentView.prototype.render.call(this);
        //does not work with firefox
		//object = '<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/' + this.model.get('shortSrc') + '&hl=en&fs=1"><param name="allowFullScreen" value="true"><embed src="http://www.youtube.com/v/' + this.model.get('shortSrc') + '&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></object>';
        object = '<div style="padding:10px"><iframe type="text/html" width="425" height="344" src="http://www.youtube.com/embed/'+ this.model.get('shortSrc') +'?wmode=transparent"  frameborder="0" wmode="Opaque"/></iframe></div>';
        this.$object = $(object);
        this.$embed = this.$object.find('iframe');
        scale = this.model.get("scale");
        if (scale && scale.width) {
          this.$object.attr(scale);
          this.$embed.attr(scale);
        } else {
          this.model.attributes.scale = {
            width: 425,
            height: 344
          };
        }
        this.$el.find('.content').append(this.$object);
        return this.$el;
      }
    });
    types = {
      html5: Html5,
      youtube: Youtube
    };

    return function(params) {
    	return new types[params.model.get('videoType')](params);
    };
  });