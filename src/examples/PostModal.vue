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
