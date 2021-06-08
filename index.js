/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let model, labels;

const classify = async (inputs) => {
  const results = await model.classify(inputs);
  return inputs.map((d, i) => {
    const obj = {'text': d};
    results.forEach((classification) => {
      obj[classification.label] = classification.results[i].match;
    });
    return obj;
  });
};

const addPredictions = (predictions) => {
  const tableWrapper = document.querySelector('#table-wrapper');

  predictions.forEach(d => {
    const predictionDom = `<div class="row">
      <div class="text">${d.text}</div>
      ${
        labels
            .map(
                label => {return `<div class="${
                                 'label' +
                    (d[label] === true ? ' positive' :
                                         '')}">${d[label] === false || d[label] === null?'NO':'YES'}</div>`})
            .join('')}
    </div>`;
    tableWrapper.insertAdjacentHTML('beforeEnd', predictionDom);
  });
};

const predict = async () => {

  model = await toxicity.load();
  labels = model.model.outputNodes.map(d => d.split('/')[0]);

  const tableWrapper = document.querySelector('#table-wrapper');
  tableWrapper.insertAdjacentHTML(
      'beforeend', `<div class="row">
    <div class="text">Text</div>
    ${labels.map(label => {
              return `<div class="label">${label.replace('_', ' ')}</div>`;
            }).join('')}
  </div>`);

  document.querySelector('#classify-new')
      .addEventListener('submit', (e) => {
        const text = document.querySelector('#classify-new-text-input').value;
        document.querySelector('#classify-new-text-input').disable = true;
        //document.querySelector('#loader').getElementsByClassName.visibility = 'visible';
        const predictions = classify([text]).then(d => {
          addPredictions(d);
        })
        .finally(() => {
          document.querySelector('#classify-new-text-input').value = '';
          //document.querySelector('#loader').getElementsByClassName.visibility = 'hidden';
          document.querySelector('#classify-new-text-input').disable = false;
        });

        // Prevent submitting the form which would cause a page reload.
        e.preventDefault();
      });
};

predict();