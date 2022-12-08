<template>
    <transition name="modal-t">
        <div class="modal-mask img-modal img-modal-overlay" @click.self="$emit('close')">
            <div class="modal-wrapper ">
                <div class="modal-container">
                    <span class="text-bold text-lg mt-3">닉네임 변경</span>
                    <div class="align-right">
                        <slot name="header">  </slot>
                        <button type="button" @click="$emit('close')" class="p-0 btn btn-link text-dark fixed-plugin-close-button">
                            <i class="fa fa-close" aria-hidden="true"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <slot/> 
                            
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>