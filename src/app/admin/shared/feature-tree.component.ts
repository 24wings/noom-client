import { Component, Injector } from '@angular/core';
import { FeatureTreeEditModel } from '@app/admin/shared/feature-tree-edit.model';
import { AppComponentBase } from '@shared/common/component-base';
import { FlatFeatureDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import * as _ from 'lodash';
import { NzTreeNode } from 'ng-zorro-antd';
import { getAllTreeNodes, getCheckedTreeNodes, list2Tree } from '../../shared/utils/list-to-tree.service';

@Component({
  selector: 'feature-tree',
  templateUrl: './feature-tree.component.html',
  styleUrls: ['./feature-tree.component.less']
})
export class FeatureTreeComponent extends AppComponentBase {
  treeData: any;
  selectedFeatures: NzTreeNode[] = [];

  constructor(private _treeDataHelperService: TreeDataHelperService, injector: Injector) {
    super(injector);
  }

  _editData: FeatureTreeEditModel;

  set editData(val: FeatureTreeEditModel) {
    this._editData = val;
    this.setSelectedNodes(val);
    this.setTreeData(val.features);

  }

  setTreeData(permissions: FlatFeatureDto[]) {
    this.treeData = list2Tree(permissions, 'name', 'parentName', 'displayName');
  }

  setSelectedNodes(val: FeatureTreeEditModel) {
    this.selectedFeatures = [];
    val.featureValues.forEach(v => {
      const f = val.features.find(feature => feature.name === v.name);
      if (f) {
        (f as any).checked = true;
      }
    });

  }

  setSelectedNode(featureName, value) {
    let node;

    if (value === 'true') {
      node = this._treeDataHelperService.findNode(this.treeData, { data: { name: featureName } });
      this.selectedFeatures.push(node);
    } else if (value && value !== 'false') {
      node = this._treeDataHelperService.findNode(this.treeData, { data: { name: featureName } });
      node.value = value;
      this.selectedFeatures.push(node);
    }
  }

  getGrantedFeatures(): NameValueDto[] {
    if (!this._editData.features) {
      return [];
    }

    const features: NameValueDto[] = [];

    for (const feature of this._editData.features) {
      const dto = new NameValueDto();
      dto.name = feature.name;
      dto.value = this.getFeatureValueByName(dto.name);

      features.push(dto);
    }

    return features;
  }

  onDropdownChange(node) {
    if (node.value) {
      node.selected = true;
    }
  }

  onInputChange(node) {
    if (node.value) {
      node.selected = true;
    }
  }

  findFeatureByName(featureName: string): FlatFeatureDto {
    const self = this;

    const feature = _.find(self._editData.features, f => f.name === featureName);

    if (!feature) {
      abp.log.warn('Could not find a feature by name: ' + featureName);
    }

    return feature;
  }

  findFeatureValueByName(featureName: string) {
    const self = this;
    const feature = self.findFeatureByName(featureName);
    if (!feature) {
      return '';
    }

    const featureValue = _.find(getAllTreeNodes(this.treeData).map(n => n.origin), f => f.name === featureName);
    if (!featureValue) {
      return feature.defaultValue;
    }

    return featureValue.value;
  }

  isFeatureValueValid(featureName: string, value: string): boolean {

    const self = this;
    const feature = self.findFeatureByName(featureName);
    if (!feature || !feature.inputType || !feature.inputType.validator) {
      return true;
    }

    const validator = feature.inputType.validator as any;
    if (validator.name === 'STRING') {
      if (value === undefined || value === null) {
        return validator.attributes.AllowNull;
      }

      if (typeof value !== 'string') {
        return false;
      }

      if (validator.attributes.MinLength > 0 && value.length < validator.attributes.MinLength) {
        return false;
      }

      if (validator.attributes.MaxLength > 0 && value.length > validator.attributes.MaxLength) {
        return false;
      }

      if (validator.attributes.RegularExpression) {
        return new RegExp(validator.attributes.RegularExpression).test(value);
      }
    } else if (validator.name === 'NUMERIC') {
      const numValue = parseInt(value, 10);

      if (isNaN(numValue)) {
        return false;
      }

      const minValue = validator.attributes.MinValue;
      if (minValue > numValue) {
        return false;
      }

      const maxValue = validator.attributes.MaxValue;
      if (maxValue > 0 && numValue > maxValue) {
        return false;
      }
    }

    return true;
  }

  areAllValuesValid(): boolean {
    let result = true;

    _.forEach(getCheckedTreeNodes(this.treeData).map(e => e.origin), feature => {
      const value = this.getFeatureValueByName(feature.name);
      if (!this.isFeatureValueValid(feature.name, value)) {
        result = false;
      }
    });

    return result;
  }

  setFeatureValueByName(featureName: string, value: string): void {
    const featureValue = _.find(this._editData.featureValues, f => f.name === featureName);
    if (!featureValue) {
      return;
    }

    featureValue.value = value;
  }

  isFeatureSelected(name: string): boolean {
    return getCheckedTreeNodes(this.treeData).map(n => n.origin).filter(n => n.name === name).length === 1;
  }

  getFeatureValueByName(featureName: string): string {
    const feature = getAllTreeNodes(this.treeData).find(n => n.origin.name === featureName).origin;
    if (!feature) {
      return null;
    }

    if (feature.defaultValue) {
      return feature.defaultValue;
    }

    if (!this.isFeatureSelected(featureName)) {
      return 'false';
    }

    return 'true';
  }

  isFeatureEnabled(featureName: string): boolean {
    const self = this;
    const value = self.findFeatureValueByName(featureName);
    return value.toLowerCase() === 'true';
  }

  nodeSelect(event) {
    const parentNode = this._treeDataHelperService.findParent(this.treeData, { data: { name: event.node.data.name } });

    // while (parentNode != null) {
    //   const isParentNodeAdded = _.find(this.selectedFeatures, f => f.data.name === parentNode.data.name);
    //   if (!isParentNodeAdded) {
    //     this.selectedFeatures.push(parentNode);
    //   }

    //   parentNode = this._treeDataHelperService.findParent(this.treeData, { data: { name: parentNode.data.name } });
    // }
  }

  onNodeUnselect(event) {
    // const childrenNodes = this._treeDataHelperService.findChildren(this.treeData, { data: { name: event.node.data.name } });
    // childrenNodes.push(event.node.data.name);
    // _.remove(this.selectedFeatures, x => childrenNodes.indexOf(x.data.name) !== -1);
  }
}
