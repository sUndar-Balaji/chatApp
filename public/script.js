!function (window, io, undefined) {

	var socket = io.connect();

	swal({
		title: "Enter yourr nick name",
		text: 'Write something interesting:',
		type: 'input',
		showCancelButton: true,
		closeOnConfirm: true,
		animation: "slide-from-top"
	}, function(nickname){

		socket.emit ( 'nickname', nickname, function (d) {
 
 			//console.log (d);

 			userListRender(d, socket);

		} );

	}); 


		socket.on ('newUsers', function (d) {

			userListRender(d);
			//console.log (d);

		});


		var userListRender = function (d, socket) { 

			var users, usersOnline = $(".usersOnline");

			usersOnline.find('li').remove();

 			d.forEach ( function (val, key) {

 				console.log (val);
				users = $('<li>', {text: val, class: 'pull-left'});

				users.append ('<div></div>');

				usersOnline.append (users);


 			} );

		};

		socket.on ('newMsg', function (d) {

			$(".chats").append($( "<p><b>" + d.userSent + "</b>: " + d.msg + "</p>" )); 
			$(".chats").scrollTop($(".chats")[0].scrollHeight);



		});

		socket.on ('newUserJoinedRoom', function (d) {

			$(".chats").append($( "<p><b>" + d.newUser + "</b>: has joined to this room</p>" )); 
			$(".chats").scrollTop($(".chats")[0].scrollHeight);			

		});

	$(".chatBox textarea").on ("keypress", function (e) {



		if (e.which === 13) { 
			if ( $(this).val().trim() !== "" ) {  
				$(".chats").append($( "<p><b>me</b>: " + $(this).val() + "</p>" )); 
				socket.emit ('send', $(this).val());
				$(".chats").scrollTop($(".chats")[0].scrollHeight);
			}

			$(this).val(''); 

		}


	});


	$("#sendMsg").click ( function () {

		if ( $(".chatBox textarea").val().trim() !== "" ) {  
				$(".chats").append($( "<p><b>me</b>: " + $(".chatBox textarea").val() + "</p>" )); 
				socket.emit ('send', $(".chatBox textarea").val());
				$(".chats").scrollTop($(".chats")[0].scrollHeight);
		}

		$(".chatBox textarea").val(''); 

	} );




	var handleDrag = function(e) {
                //kill any default behavior
                e.stopPropagation();
                e.preventDefault();

                document.getElementsByClassName("showOnDrop")[0].style.display = "block";



            };
            var handleDragOut = function(e) {
                //kill any default behavior
                e.stopPropagation();
                e.preventDefault();

                document.getElementsByClassName("showOnDrop")[0].style.display = "none";



            };
            var handleDrop = function(e) {
                //kill any default behavior
                 document.getElementsByClassName("showOnDrop")[0].style.display = "none";
                e.stopPropagation();
                e.preventDefault();
                //console.log(e);
                //get x and y coordinates of the dropped item
                x = e.clientX;
                y = e.clientY;
                //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
                var file = e.dataTransfer.files[0];

                console.log (file.type);

                //don't try to mess with non-image files
                if ( file.type.match('image.*') || file.type.match('video.*') ) {
                    //then we have an image,

                    //we have a file handle, need to read it with file reader!
                    var reader = new FileReader();

                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        //get the data uri
                        var dataURI = theFile.target.result;
                        //make a new image element with the dataURI as the source

                        if ( file.type.match('image.*') ) {   
                        var img = document.createElement("img");
                        img.src = dataURI;


                        document.getElementById('drop_zone').appendChild (img) ;
                    }
                    	else {
                    		var video = document.createElement("video");
                        video.src = dataURI;


                        document.getElementById('drop_zone').appendChild (video) ;
                    	}

                        socket.emit ('sendImg', dataURI);

                        //Insert the image at the carat
/*
                        // Try the standards-based way first. This works in FF
                        if (document.caretPositionFromPoint) {
                            var pos = document.caretPositionFromPoint(x, y);
                            range = document.createRange();
                            range.setStart(pos.offsetNode, pos.offset);
                            range.collapse();
                            range.insertNode(img);
                        }
                        // Next, the WebKit way. This works in Chrome.
                        else if (document.caretRangeFromPoint) {
                            range = document.caretRangeFromPoint(x, y);
                            range.insertNode(img);
                        }
                        else
                        {
                            //not supporting IE right now.
                            console.log('could not find carat');
                        }

*/
                    });
                    //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
                    reader.readAsDataURL(file);
                }
            };

            var dropZone = document.getElementById('drop_zone');
            dropZone.addEventListener('dragover', handleDrag, false);
            dropZone.addEventListener('dragleave', handleDragOut, false);
            dropZone.addEventListener('drop', handleDrop, false);


    	socket.on ( 'newImg', function (d) {

    		if (file.type.match('image.*'))
    		$(".chats").append($( "<p><b>" + d.userSent + "</b>: <img src=" + d.data + "></p>" )); 
    		else
    		$(".chats").append($( "<p><b>" + d.userSent + "</b>: <video src=" + d.data + "></video></p>" )); 	
			$(".chats").scrollTop($(".chats")[0].scrollHeight); 

    	} );


}(window, io);