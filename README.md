direct
======
nodejs web mvc framework

目标为基于nodejs做一个mvc的web框架，类似于php的yii框架，提供一个能够快速开发web项目的基础。


protected文件夹是网站内容文件夹。运行网站时，会首先使用less编译css，然后存放到根目录下assets文件夹下的css目录下。如果配置文档指定develop为false，则压缩后放到assets目录下。js文件也会压缩。
