<?php

    require_once "headless-cms.php";

    $page = handle_request();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#232323">

    <!-- Insert any custom head contents -->
    <?php echo $page->head_content ?>

    <!-- Import the Client Side Router -->
    <!-- Remove this if you don't wish to use the client-side routing function of the Headless CMS -->
    <!-- <script type="module" src="/headless-cms-scripts/client-side-router.js"></script> -->

    <!-- Import Alpine JS -->
    <!-- Remove this if you don't wish to use Alpine JS across you webpages -->
    <!-- <script defer src="/scripts/alpine-requests.js"></script> -->

    <script defer src="/scripts/alpine.js"></script>
    


    <!-- If the title property is set, insert here. -->
    <?php echo $page->get_property('title') ?>

    <!-- If the description property is set, insert here. -->
    <?php echo $page->get_property('description') ?>

    <!-- If the og-image property is set, insert here. -->
    <?php echo $page->get_property('og-image') ?>

    <!-- If the og-type property is set, insert here. -->
    <?php echo $page->get_property('og-type') ?>

    <!-- If the og-url property is set, insert here. -->
    <?php echo $page->get_property('og-url') ?>

    <!-- If the favicon property is set, insert here. Default value is '/resources/favicon.png' -->
    <?php echo $page->get_property('favicon') ?>



    <!-- Add global stylesheet imports here -->
    <link rel="stylesheet" href="/resources/default-styles.css">
    <link rel="stylesheet" href="/resources/globals.css">
    <link rel="stylesheet" href="/resources/utils.css">

    <script type="module" src="/scripts/index.js"></script>


</head>
<body>

    <header x-data="{ menuOpen: false }">
        <a class="header-link" href="/">
            <img src="/resources/images/logo-large-no-bg.png" alt="Logo">
            <!-- <span>Exeter Application Tracker</span> -->
        </a>
        
        <div class="flex gap-m">

            <button class="mobile-menu-toggle m-show-flex" x-on:click="menuOpen = !menuOpen" x-bind:class="menuOpen ? 'open' : ''" aria-label="Menu Toggle Button" aria-pressed="false">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </button>

            <div class="header-nav" :class="menuOpen ? 'open' : ''">

                <a class="header-link m-show-flex" href="/" @click="menuOpen = false">Home</a>

                <a class="header-link" href="/about" @click="menuOpen = false">About</a>

                <!-- <a class="header-link" href="/advice" @click="menuOpen = false">Advice</a> -->

                <a href="https://apps.edward-blewitt.uk/backend/api/urls/GET-goto-url.php?id=67870bd57d12e" @click="menuOpen = false">
                    <button class="go-to-tracker">
                        <span>Go to tracker</span>
                        <img class="icon" src="/resources/images/icons/external.svg" alt="Exterior link icon">
                    </button>
                </a>
            </div>
        </div>
    </header>

    
    <main>
        <!-- Insert the page content in here -->
        <?php echo $page->content; ?>
    </main>


    <footer>
        <div class="ed">
            <img src="https://edward-blewitt.uk/resources/images/me.jpg" class="ed-image" alt="Profile image of Ed Blewitt">
            <div class="ed-desc">
                <p>
                    Designed with ❤ by <a target="_blank" class="text-orange underline" href="https://edward-blewitt.uk">Ed Blewitt</a> to help students.
                </p>
            </div>
        </div>

        <div class="flex justify-center text-center">
            <a href="https://github.com/Littled2/exeter-application-tracker" class="flex gap-s align-center text-white">
                <img src="/resources/images/logos/github-mark-white.png" alt="Github logo" class="icon">
                <span>Open source project</span>
            </a>
        </div>

        <div class="flex space-between gap-m text-white m-flex-col align-center">
            <a href="/" class="flex align-center gap-s">
                <img src="/resources/images/logo-large-no-bg.png" style="height: 1.85rem;" loading="lazy" alt="Exeter Application Tracker logo">
            </a>

            <div class="flex align-center gap-s">
                <small>
                    <a href="/terms-of-service">Terms of Service</a>
                </small>
                <small>|</small>
                <small>
                    <a href="/privacy-policy">Privacy Policy</a>
                </small>
            </div>
        </div>
    </footer>

</body>
</html>