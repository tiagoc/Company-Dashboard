
function DashletModuleController($scope, $http, $injector) {

    $scope.items = [];

    $scope.groups = [];



    $scope.C = {};
    $scope.showModal = false;
    $scope.pager = {
        noOfPages: 1,
        currentPage: 1,
        maxSize: 10
    };
    this.unKnownGroup = "(unkown)";
    var self = this;
    this.mvcGroup = "[MVCDefault]";

    $scope.startUp = function () {
        $scope.bindCheckItems();
        $scope.items = [];
        require(["jdash/provider/Manager",
                 "klt/core/when",
                 "jdash/provider/JsonRest/JsonRestProvider",
                 "jdash/model/DashletModuleModel",
                 "jdash/model/DashboardModel"
        ],
        function (Manager, when, JsonRest, DashletModuleModel, DashboardModel) {
            $scope.clearForm();
            self.Manager = Manager;
            self.when = when;
            self.JsonRestProvider = JsonRest;
            self.DashletModuleModel = DashletModuleModel;
            self.DashboardModel = DashboardModel;
            var provider = Manager.getInstance();
            self.provider = provider;
            self.requsestComplated = true;
            self.updateGroups();
            $scope.prepareApp("dashletModules");
        });
    }
    $scope.prepareApp = function (type) {
        self.updateGroups();
        self.type = type;
        $scope.pager.currentPage = 1;
        $scope.useDefaultEditorClientModule = true;
        $scope.groupName = $scope.groups[0];
        switch (type) {
            case "dashletModules":
                self.binder = self.loadDashlets;
                self.saver = self.saveDashlet;
                self.deleter = self.deleteDashletModule;
                $scope.title = "Manage Dashlet Modules";
                break;
            default:
        }
        $scope.bindItems();
    }

    $scope.bindItems = function (page) {
        if (!self.requsestComplated) return;
        self.requsestComplated = false;
        $scope.items = [];
        self.binder.call(this, page);
    }

    self.getFilter = function (page) {
        var currentPage = page || $scope.pager.currentPage;
        var filter = null;
        if ($scope.searchText) {
            filter = {
                filters: [
                    {
                        field: "title",
                        value: $scope.searchText,
                        op: "contains"
                    }
                ]
            }
        } else if ($scope.searchGroup) {
            filter = {
                filters: [
                    {
                        field: "metaData.group",
                        value: $scope.searchGroup,
                        op: "contains"
                    }
                ]
            }
        }
        return {
            filter: filter,
            paging: {
                take: $scope.pager.maxSize,
                skip: (currentPage - 1) * $scope.pager.maxSize
            }
        }
    }

    self.ComplateRequest = function (modules) {
        $scope.items = modules.data;
        $scope.pager.noOfPages = ((modules.meta.count / $scope.pager.maxSize) % $scope.pager.maxSize) == 0 ? (modules.meta.count / $scope.pager.maxSize) : (Math.floor((modules.meta.count / $scope.pager.maxSize)) + 1);
        $scope.$digest();
        self.requsestComplated = true;
    }

    self.loadDashlets = function (page) {
        self.when(self.provider.searchDashletModules(self.getFilter(page)),
            function (modules) {
                self.ComplateRequest(modules);
            },
            function (err) {
                self.failRequest(err);
            }
        );
    }

    self.failRequest = function (err) {
        console.log(err);
        alert(err.message + " Please check your connection string and view your browser's console to get more information about error.");
        self.requsestComplated = true;
    }

    self.updateGroups = function () {
        self.when(self.provider.getDashletGroups(),
        function (groups) {
            $scope.$apply(function () {
                $scope.groups = groups;
            });
        },
        function (err) {
            self.failRequest(err);
        }
        );
    }

    $scope.delete = function (module) {
        if (confirm("Do you really want to delete " + module.title + " ?")) {
            self.deleter.call(this, module);
        }
    }

    self.deleteDashletModule = function (module) {
        self.when(self.provider.deleteDashletModule(module.id).then(
        function () {
            self.completeDelete(module);
        },
        function (err) {
            self.failRequest(err);
        }));
    }

    self.deleteDashboard = function (module) {
        self.when(self.provider.deleteDashboard(module.id).then(
        function () {
            self.completeDelete(module);
        },
        function (err) {
            self.failRequest(err);
        }));
    }

    self.completeDelete = function (module) {
        $scope.items.splice($scope.items.indexOf(module), 1);
        self.updateGroups();
        $scope.$digest();
    }

    $scope.clearForm = function () {
        $scope.modalHeader = "Create New Module";
        $scope.currentModel = {};
        $scope.disableButton = false;
        $scope.feedBackMessage = "";
        $scope.useDefaultClientModule = true;
        $('#myTab a:last').tab('show');
    }

    $scope.save = function () {
        var module;
        try {
            $scope.prepareSave();
            module = angular.fromJson($scope.currentModel);
        } catch (e) {
            self.feedBack("Can not serialize to JSON!", true);
            return;
        }
        $scope.disableButton = true;
        //self.feedBack("saving...", false);
        self.saver.call(this, module);
    }

    $scope.addPaneCommands = function (customCommand) {
        $scope.command = customCommand;
    }

    $scope.removeCustomCommand = function (customCommand) {
        $scope.customCommands.splice($scope.customCommands.indexOf(customCommand), 1);
    }

    self.saveDashlet = function (dashletModule) {
        if (dashletModule.id && dashletModule.id.lenght != 0) {
            var module = self.DashletModuleModel(dashletModule);
            self.when(self.provider.saveDashletModule(module), self.successSave, self.failSave);
        } else {
            var moduleToOparate = new self.DashletModuleModel(dashletModule);
            self.when(self.provider.createDashletModule(moduleToOparate), self.successSave, self.failSave);
        }
    }

    self.saveDashboard = function (module) {
        if (module.id && module.id.lenght != 0) {
            var module = self.DashboardModel(module);
            self.when(self.provider.saveDashboard(module), self.successSave, self.failSave);
        } else {
            var moduleToOparate = new self.DashboardModel(module);
            self.when(self.provider.createDashboard(moduleToOparate), self.successSave, self.failSave);
        }
    }

    self.successSave = function (data) {
        $scope.showModal = false;
        $scope.disableButton = false;
        $scope.bindItems();
        $scope.$digest();
        $('#moduleModal').modal('hide');
    }

    self.failSave = function (data) {
        alert(data.message);
        self.feedBack("Could not saved dashlet module!", true);
        $scope.disableButton = false;
        $scope.$digest();
    }

    self.feedBack = function (message, isError) {
        if (isError) {
            alert(message);
        }
        $scope.feedBackMessage = message;
        $scope.feedBackClass = isError ? "label-important" : "label-info";
    }

    $scope.toggleModal = function (val) {
        $scope.clearForm();
        $scope.dashletConfigured = false;
        $scope.groupName = "";
        $scope.showModal = val ? val : !$scope.showModal;
        $scope.bindCheckItems();
        $scope.customCommands = [];
        $scope.authorizationModel = [];
    }
    $scope.upateModule = function (item) {
        $scope.toggleModal(true);
        $scope.modalHeader = "UPDATE MODULE: " + item.title;
        $scope.currentModel = item.serialized();
        $scope.groupName = item.metaData.group;
        if ($scope.currentModel.config.editor) {
            $scope.dashletConfigured = true;
        }

        if ($scope.currentModel.path == self.mvcGroup) {
            $scope.useDefaultClientModule = true;
        } else $scope.useDefaultClientModule = false;

        if (item.paneConfig.customCommands)
            $scope.customCommands = item.paneConfig.customCommands;

        if (item.authorization.data)
            $scope.authorizationModel = item.authorization.data;

        $scope.prepareUpdate();

    };

    $scope.cloneDashlet = function (dashletModule) {
        var moduleToOparate = dashletModule.serialized();
        var title = moduleToOparate.title;
        delete moduleToOparate.id;
        moduleToOparate.title = "Copy of " + title;
        self.saver.call(this, moduleToOparate);
    }

    $scope.filterByGroup = function (item) {
        return item;
    };

    $scope.getMenuClass = function (type) {
        return type == self.type ? "active" : "";
    }

    $scope.prepareSave = function () {
        var groupName = $scope.customgroupName ? $scope.customgroupName : $scope.groupName;
        var path = $scope.currentModel.path;
        $scope.currentModel.path = path && !$scope.useDefaultClientModule ? path : self.mvcGroup;
        $scope.currentModel.metaData = $scope.currentModel.metaData || {};
        $scope.currentModel.metaData.group = groupName;
        if ($scope.dashletConfigured) {
            if (!$scope.currentModel.config.editor) {
                $scope.currentModel.config.editor = {};
            }
            var editorPath = $scope.currentModel.config.editor.path;

            $scope.currentModel.config.editor.path = editorPath && !$scope.useDefaultEditorClientModule ? editorPath : self.mvcGroup;
        } else {
            $scope.currentModel.config.editor = null;
        }
        $scope.builtCommands = [];
        if ($scope.dashletMaximize) {
            $scope.builtCommands.push("maximize");
        }
        if ($scope.dashletRefreshed) {
            $scope.builtCommands.push("refresh");
        }
        if ($scope.dashletRemove) {
            $scope.builtCommands.push("remove");
        }
        if ($scope.dashletRemove) {
            $scope.builtCommands.push("clone");
        }

        $scope.currentModel.paneConfig = {
            'builtInCommands': $scope.builtCommands
        };

        if ($scope.customCommands.length > -1)
            $scope.currentModel.paneConfig.customCommands = $scope.customCommands;

        if ($scope.authorizationModel)
            $scope.currentModel.authorization = { 'data': $scope.authorizationModel };

        if ($scope.dashletconfig && JSON.parse($scope.dashletconfig)) {
            $scope.currentModel.dashletConfig = JSON.parse($scope.dashletconfig);
        }
    }

    $scope.prepareUpdate = function () {
        var buildCommands = [];
        buildCommands = $scope.currentModel.paneConfig.builtInCommands;
        if (buildCommands) {
            $scope.dashletMaximize = buildCommands.indexOf("maximize") > -1;
            $scope.dashletRefreshed = buildCommands.indexOf("refresh") > -1;
            $scope.dashletRemove = buildCommands.indexOf("remove") > -1;
            $scope.dashletClone = buildCommands.indexOf("clone") > -1;
        }
        if ($scope.currentModel.config.editor) {
            if ($scope.currentModel.config.editor.path == self.mvcGroup)
                $scope.useDefaultEditorClientModule = true;
        }
        $scope.dashletconfig =angular.toJson($scope.currentModel.dashletConfig);
       
    }



    $scope.bindCheckItems = function () {
        $scope.dashletMaximize = false;
        $scope.dashletRefreshed = false;
        $scope.dashletRemove = true;
        $scope.dashletClone = true;
    }

    $scope.clearCommand = function () {
        $scope.command = {};
    }



    $scope.authorizationModel = [];

    $scope.addAuthorizationModel = function (item) {
        $scope.authModel = {};
        $scope.authorizationModel.push(angular.copy(item));
    }

    $scope.removeAuthorization = function (item) {
        for (var i = 0; i < $scope.authorizationModel.length; i++) {
            if ($scope.authorizationModel[i].key == item.key) {
                $scope.authorizationModel.splice(i, 1);
                return;
            }
        }
    }
    $scope.customCommands = [];
    $scope.addCommand = function (item) {

        for (var i = 0; i < $scope.customCommands.length; i++) {
            if ($scope.customCommands[i].title == item.title) {
                $scope.customCommands[i] = item;
                return;
            }
        }
        $scope.customCommands.push(angular.copy(item));
    }

    $scope.isActive = function (tabName) {
        return (this.activeTab == tabName) ? 'active' : '';
    };

    window.runApp = function () {
        $scope.startUp();
    };




}