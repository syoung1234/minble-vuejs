<template>
    <transition name="modal-t">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="align-right">
                        <slot name="header">  </slot>
                        <!-- <button type="button" class="shadow-none navbar-toggler ms-2" @click="$emit('close')"> -->
                        <button type="button" @click="$emit('close')" class="p-0 btn btn-link text-dark fixed-plugin-close-button">
                            <i class="fa fa-close" aria-hidden="true"></i>
                        </button>
                            <!-- <span>X</span>
                        </button> -->
                    </div>

                    <div class="modal-body">
                        <slot/> 
                            
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0/5);
    display: table;
    transition: opacity 0/3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 200px;
    margin: 0px auto;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top : 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: sacle(1.1);
    transform: scale(1.1);
}
.modal-body,
.modal-t {
    color: #666 !important;
}
</style>