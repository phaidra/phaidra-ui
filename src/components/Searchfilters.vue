<template>

  <v-container fluid grid-list-md>
    <ul>
      <li v-for="(f, i) in this.facetQueries" :key="i">
        <span class="facet-label" :class="{ active: f.show }">{{ $t(f.label) }}</span>

      </li>
    </ul>
  </v-container>

<!--

<div class="filters" layout-fill>
        <ul>
          <li ng-repeat="f in sc.facetQueries">
            <md-icon ng-click="sc.showFacet(f)" ng-if="f.show" md-svg-icon="univie:stop2"></md-icon>
            <md-icon ng-click="sc.showFacet(f)" ng-if="!f.show" md-svg-icon="univie:checkbox-unchecked"></md-icon>
            <span ng-click="sc.showFacet(f)" class="facet-label" ng-class="{ active: f.show }">{{ f.label | translate }}</span>
            <ul ng-if="f.show">
              <li flex ng-repeat="q in f.queries">
                <div layout="column">
                  <span layout="row" layout-align="start center" ng-click="sc.toggleFacet(q,f)">
                    <md-icon ng-if="q.active" md-svg-icon="univie:stop2"></md-icon>
                    <md-icon ng-if="!q.active" md-svg-icon="univie:checkbox-unchecked"></md-icon>
                    <span ng-class="{ active: q.active }" class="facet-label">{{ q.label | translate }}</span>
                    <span class="facet-count" ng-show="q.count>0">({{q.count}})</span>
                  </span>
                  <ul ng-if="q.active && q.childFacet" >
                    <li ng-repeat="q1 in q.childFacet.queries" >
                     <div layout="column">
                        <span layout="row" layout-align="start center" ng-click="sc.toggleFacet(q1,q.childFacet)">
                          <md-icon ng-if="q1.active" md-svg-icon="univie:stop2"></md-icon>
                          <md-icon ng-if="!q1.active" md-svg-icon="univie:checkbox-unchecked"></md-icon>
                          <span ng-class="{ active: q1.active }" class="facet-label">{{ q1.label | translate }}</span>
                          <span class="facet-count" ng-show="q1.count>0">({{q1.count}})</span>
                        </span>
                        <ul ng-if="q1.active && q1.childFacet" >
                          <li ng-repeat="q2 in q1.childFacet.queries" >
                            <span layout="row" layout-align="start center" ng-click="sc.toggleFacet(q2,q1.childFacet)">
                                <md-icon ng-if="q2.active" md-svg-icon="univie:stop2"></md-icon>
                                <md-icon ng-if="!q2.active" md-svg-icon="univie:checkbox-unchecked"></md-icon>
                                <span ng-class="{ active: q2.active }" class="facet-label">{{ q2.label | translate }}</span>
                                <span class="facet-count" ng-show="q2.count>0">({{q2.count}})</span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <md-icon ng-click="sc.toggleOwnerFilter()" ng-if="sc.showOwnerFilter" md-svg-icon="univie:stop2"></md-icon>
            <md-icon ng-click="sc.toggleOwnerFilter()" ng-if="!sc.showOwnerFilter" md-svg-icon="univie:checkbox-unchecked"></md-icon>
            <span class="facet-label" ng-click="sc.toggleOwnerFilter()" ng-class="{ active: sc.showOwnerFilter }">Owner</span>
            <md-autocomplete
              layout-margin
              ng-if="sc.showOwnerFilter"
              md-selected-item="sc.selectedOwnerItem"
              md-search-text="sc.ownerSearchText"
              md-selected-item-change="sc.search()"
              md-items="item in sc.suggest('ownersuggester',sc.ownerSearchText)"
              md-item-text="item.term"
              md-min-length="2"
              ng-keypress="sc.enterSearch($event);"
              placeholder="{{ 'Add owner' | translate }}...">
              <md-item-template>
                <span md-highlight-text="sc.ownerSearchText" md-highlight-flags="^i">{{item.term}}</span>
              </md-item-template>
            </md-autocomplete>
          </li>
          <li>
            <md-icon ng-click="sc.toggleAuthorFilter()" ng-if="sc.showAuthorFilter" md-svg-icon="univie:stop2"></md-icon>
            <md-icon ng-click="sc.toggleAuthorFilter()" ng-if="!sc.showAuthorFilter" md-svg-icon="univie:checkbox-unchecked"></md-icon>
            <span class="facet-label" ng-click="sc.toggleAuthorFilter()" ng-class="{ active: sc.showAuthorFilter }">{{ "Authors" | translate }}</span>
            <div layout-margin  layout="row" layout-align="center center" ng-if="sc.showAuthorFilter" ng-repeat="role in sc.sd.pers_authors">
              <md-icon flex="20" md-svg-icon="social:ic_person_24px" class="s24" aria-label="{{ 'Personal' | translate }}"></md-icon>
              <md-chips flex="80" class="custom-chips" ng-model="role.values" md-removable="1" placeholder="{{ 'ADD_PREFIX' | translate }}  {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." secondary-placeholder="{{ 'ADD_PREFIX_2' | translate }} {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." md-on-add="sc.search()" md-on-remove="sc.search()">
                <md-chip-template>
                  <span>
                    <strong>{{$chip}}</strong>
                  </span>
                </md-chip-template>
              </md-chips>
            </div>
            <div layout-margin layout="row" layout-align="center center" ng-if="sc.showAuthorFilter" ng-repeat="role in sc.sd.corp_authors">
              <md-icon flex="20" md-svg-icon="action:ic_account_balance_24px" class="s24" aria-label="{{ 'Personal' | translate }}"></md-icon>
              <md-chips flex="80" class="custom-chips" ng-model="role.values" md-removable="1" placeholder="{{ 'ADD_PREFIX' | translate }}  {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." secondary-placeholder="{{ 'ADD_PREFIX_2' | translate }} {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." md-on-add="sc.search()" md-on-remove="sc.search()">
                <md-chip-template>
                  <span>
                    <strong>{{$chip}}</strong>
                  </span>
                </md-chip-template>
              </md-chips>
            </div>
          </li>
          <li>
            <md-icon ng-click="sc.toggleRolesFilter()" ng-if="sc.showRolesFilter" md-svg-icon="univie:stop2"></md-icon>
            <md-icon ng-click="sc.toggleRolesFilter()" ng-if="!sc.showRolesFilter" md-svg-icon="univie:checkbox-unchecked"></md-icon>
            <span class="facet-label" ng-click="sc.toggleRolesFilter()" ng-class="{ active: sc.showRolesFilter }">{{ "Roles" | translate }}</span>
            <div ng-if="sc.showRolesFilter" class="role-filter">
              <span class="md-caption">{{ 'Personal' | translate }}</span>
              <md-select ng-model="sc.selectedPersRole" placeholder="{{ 'Add role' | translate }}..." md-on-close="sc.addPersRoleFilter()">
                <md-option ng-repeat="role in sc.marcRolesArray | orderBy:'value'" ng-value="role.id">{{ role.value | translate }}</md-option>
              </md-select>
              <span class="md-caption">{{ 'Corporate' | translate }}</span>
              <md-select ng-model="sc.selectedCorpRole" placeholder="{{ 'Add role' | translate }}..." md-on-close="sc.addCorpRoleFilter()">
                <md-option ng-repeat="role in sc.marcRolesArray | orderBy:'value'" ng-value="role.id">{{ role.value | translate }}</md-option>
              </md-select>
              <div ng-repeat="role in sc.sd.roles" ng-show="sc.sd.roles.length>0" >
                <div layout="row" layout-align="center center">
                  <md-icon flex="20" ng-if="role.type=='pers'" md-svg-icon="social:ic_person_24px" class="s24" aria-label="{{ 'Personal' | translate }}"></md-icon>
                  <md-icon flex="20" ng-if="role.type=='corp'" md-svg-icon="action:ic_account_balance_24px" class="s24" aria-label="{{ 'Corporate' | translate }}"></md-icon>
                  <md-chips flex="80" class="custom-chips" ng-model="role.values" md-removable="1" placeholder="{{ 'ADD_PREFIX' | translate }}  {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." secondary-placeholder="{{ 'ADD_PREFIX_2' | translate }} {{role.label | translate }} {{ 'ADD_SUFFIX' | translate }}..." layout-fill layout-margin  md-on-add="sc.search()" md-on-remove="sc.search()">
                    <md-chip-template>
                      <span>
                        <strong>{{$chip}}</strong>
                      </span>
                    </md-chip-template>
                  </md-chips>
                  <i class="material-icons role-filter-close" ng-click="sc.removeRoleFilter(role)">close</i>
                </div>
              </div>
            </div>
          </li>
        </ul>

      </div>

-->

</template>

<script>

export default {
  name: 'searchfilters',
  computed: {
    facetQueries () {
      return this.$store.state.search.facetQueries
    }
  }
}
</script>

<style scoped>


</style>
